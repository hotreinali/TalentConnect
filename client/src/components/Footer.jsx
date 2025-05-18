import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">TalentConnect</h2>
          <p className="text-sm text-gray-400">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum dolor ex et culpa quis eligendi quam modi vel sint quae sit dolorem magni optio mollitia architecto quisquam, fugit nulla libero.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/job-search" className="hover:text-white">Browse Jobs</a></li>        
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="text-sm text-gray-300">
            Email: Talent@connect.com<br />
            Phone: +64 (09) 123-4567<br />
            Address: 123 talent St, talentTown, NZ
          </p>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} TalentConnect
      </div>
    </footer>
  );
};

export default Footer;
