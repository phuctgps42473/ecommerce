import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="p-10 bg-base-200 text-base-content">
      <div className="footer">

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="footer-title">Services</h3>
            <div className="flex flex-col">
              <Link to="/products" className="link link-hover">
                Keyboards
              </Link>
              <Link to="/products?category=keycaps" className="link link-hover">
                Keycaps
              </Link>
              <Link to="/products?category=switches" className="link link-hover">
                Switches
              </Link>
              <Link to="/products?category=accessories" className="link link-hover">
                Accessories
              </Link>
            </div>
          </div>
          <div>
            <h3 className="footer-title">Company</h3>
            <div className="flex flex-col">
              <Link to="/about" className="link link-hover">
                About us
              </Link>
              <Link to="/contact" className="link link-hover">
                Contact
              </Link>
              <Link to="/jobs" className="link link-hover">
                Jobs
              </Link>
            </div>
          </div>
          <div>
            <div className="flex flex-col">
              <h3 className="footer-title">Legal</h3>
              <Link to="/terms" className="link link-hover">
                Terms of use
              </Link>
              <Link to="/privacy" className="link link-hover">
                Privacy policy
              </Link>
              <Link to="/cookies" className="link link-hover">
                Cookie policy
              </Link>
            </div>
          </div>
          <div>
            <h3 className="footer-title">Newsletter</h3>
            <div className="form-control w-full">
              <p className="label">
                <h3 className="label-text text-base-content">
                  Stay up to date with our latest news and products.
                </h3>
              </p>
              <div className="join">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered join-item w-full"
                  required
                />
                <button className="btn btn-primary join-item rounded-r-full">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>

      <div className="mt-10 text-center text-xs max-w-7xl mx-auto">
        <p>Copyright © {new Date().getFullYear()} - All right reserved by eShop Ltd.</p>
      </div>
    </footer>
  );
}
