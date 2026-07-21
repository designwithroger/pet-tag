import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <div className="pt-8 sm:pt-10 pb-6 sm:pb-8 flex justify-center">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="Petag"
          width={1600}
          height={497}
          className="h-7 sm:h-9 w-auto"
          priority
        />
      </Link>
    </div>
  );
}
