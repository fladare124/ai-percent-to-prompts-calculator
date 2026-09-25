const ERANK_AFFILIATE_HREF: string | null =
  process.env.NEXT_PUBLIC_ERANK_AFFILIATE_HREF?.trim() || null;

const HOSTINGER_AFFILIATE_HREF: string | null =
  process.env.NEXT_PUBLIC_HOSTINGER_AFFILIATE_HREF?.trim() || null;

export const ERANK_HREF = ERANK_AFFILIATE_HREF ?? "https://erank.com/";
export const ERANK_IS_AFFILIATE = ERANK_AFFILIATE_HREF !== null;
export const ERANK_REL = ERANK_IS_AFFILIATE
  ? "sponsored nofollow noopener noreferrer"
  : "noopener noreferrer";
export const ERANK_DISCLOSURE = ERANK_IS_AFFILIATE
  ? "This is an affiliate link. We may earn a commission if you subscribe, at no extra cost to you."
  : "This is a regular link; we do not currently earn commission from it.";

export const HOSTINGER_HREF = HOSTINGER_AFFILIATE_HREF ?? "https://www.hostinger.com/web-apps-hosting";
export const HOSTINGER_IS_AFFILIATE = HOSTINGER_AFFILIATE_HREF !== null;
export const HOSTINGER_REL = HOSTINGER_IS_AFFILIATE
  ? "sponsored nofollow noopener noreferrer"
  : "noopener noreferrer";
export const HOSTINGER_DISCLOSURE = HOSTINGER_IS_AFFILIATE
  ? "This is an affiliate link. We may earn a commission if you purchase, at no extra cost to you."
  : "This is a regular link; we do not currently earn commission from it.";
