import Link from "next/link"

export default function Footer() {
  return (

    <footer className="border-t bg-muted/30 py-12 md:px-16">

      <div className="container mx-auto px-6">

        <div className="grid gap-8 md:grid-cols-4">

          {/* Logo */}

          <div>

            <div className="flex items-center gap-2 mb-4">

              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                JP
              </div>

              <span className="font-semibold">
                JobPrep
              </span>

            </div>

            <p className="text-sm text-muted-foreground">
              Your trusted partner for placement preparation.
            </p>

          </div>

          {/* Product */}

          <div>

            <h4 className="font-semibold mb-4">
              Product
            </h4>

            <ul className="space-y-2 text-sm text-muted-foreground">

              <li>
                <Link href="/coding-practice" className="hover:text-foreground">
                  Coding Practice
                </Link>
              </li>

              <li>
                <Link href="/mock-tests" className="hover:text-foreground">
                  Mock Tests
                </Link>
              </li>

              <li>
                <Link href="/interview-prep" className="hover:text-foreground">
                  Interview Prep
                </Link>
              </li>

            </ul>

          </div>

          {/* Company */}

          <div>

            <h4 className="font-semibold mb-4">
              Company
            </h4>

            <ul className="space-y-2 text-sm text-muted-foreground">

              <li>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="/careers" className="hover:text-foreground">
                  Careers
                </Link>
              </li>

            </ul>

          </div>

          {/* Legal */}

          <div>

            <h4 className="font-semibold mb-4">
              Legal
            </h4>

            <ul className="space-y-2 text-sm text-muted-foreground">

              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>

            </ul>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t mt-10 pt-6 text-center text-sm text-muted-foreground">

          © 2026 JobPrep. All rights reserved.

        </div>

      </div>

    </footer>

  )
}