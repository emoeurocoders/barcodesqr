/**
 * Field formatting and validation for the two modals.
 *
 * NOTHING here talks to a payment processor, and no value it touches is
 * persisted, logged, or sent anywhere — the numbers live in React state for
 * as long as the modal is open and are dropped when it closes. The mockup's
 * own submit handler is a placeholder (`console.log('Submit Placeholder')`),
 * and this reproduces that boundary rather than inventing a charge.
 *
 * When a processor is wired up, card entry should move into its hosted
 * element and this file should shrink to nothing but the formatters.
 */

/**
 * The most digits a number starting this way can have: 15 for Amex, 19 for
 * the ranges that run that long (Maestro, UnionPay, Discover's 65), 16 for
 * everything else — Visa and Mastercard included. Capping Visa at 16 is what
 * stops a stray extra digit: with a flat 19, "4111 1111 1111 1111" plus three
 * more 1s was accepted as typed and only failed at Pay (Tami, 2026-10-20).
 */
export function maxCardDigits(digits: string) {
  if (/^3[47]/.test(digits)) return 15;
  if (/^(5[06-9]|6)/.test(digits)) return 19;
  return 16;
}

/** Digits only, capped at the longest number that card type can have. */
export function formatCardNumber(raw: string) {
  const all = raw.replace(/\D/g, "");
  const digits = all.slice(0, maxCardDigits(all));
  return digits.replace(/(.{4})(?=.)/g, "$1-");
}

/** MM/YY, inserting the slash as soon as the month is unambiguous. */
export function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCvc(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 5);
}

/**
 * The Luhn checksum, which is the `creditcard` rule the designer's form
 * asks for. 4111-1111-1111-1111 passes it; 4111-1111-1111-1112 does not.
 */
export function luhnValid(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

/** True once the expiry is a real month that has not already passed. */
export function expiryValid(value: string, now = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return false;

  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;

  // Valid through the last day of the stated month.
  const endOfMonth = new Date(year, month, 1);
  return endOfMonth > now;
}

export type CardFields = {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
};

export type CardErrors = Partial<Record<keyof CardFields, string>>;

/**
 * Messages come from the designer's `data-msg-*` attributes so the wording
 * matches the mockup rather than being reinvented here.
 */
export function validateCard(fields: CardFields): CardErrors {
  const errors: CardErrors = {};

  if (!fields.number.trim()) errors.number = "Enter Your Card Number";
  else if (!luhnValid(fields.number))
    errors.number = "Please enter a valid credit card number.";

  if (!fields.expiry.trim()) errors.expiry = "Required";
  else if (!expiryValid(fields.expiry)) errors.expiry = "Check the date";

  if (!fields.cvc.trim()) errors.cvc = "Required";
  else if (fields.cvc.length < 3 || fields.cvc.length > 5)
    errors.cvc = "3 to 5 characters";

  if (fields.name.trim().length < 2) errors.name = "Required";

  return errors;
}

/**
 * Email messages, split the way the designer's validator splits them: the
 * `data-msg-required` copy when the field is empty, and jQuery Validate's
 * own `email` message when something was typed that is not an address.
 * Saying "Enter Your Email" at someone who plainly has is just confusing.
 */
export function validateEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "Enter Your Email";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Please enter a valid email address.";
  }
  return undefined;
}
