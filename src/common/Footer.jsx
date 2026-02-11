// const Footer = () => {
//   return (
//     <footer className="bg-stone-950 text-stone-300 pt-20 pb-10">
//       <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
//         <div>
//           <h3 className="text-2xl font-serif text-white mb-4">The Galaxy</h3>
//           <p className="text-sm opacity-70">
//             Luxury hotel experience in the heart of nature.
//           </p>
//         </div>

//         <div>
//           <h4 className="uppercase text-xs mb-6 text-white tracking-widest">
//             Navigation
//           </h4>
//           <ul className="space-y-3 text-sm">
//             <li className="hover:text-white cursor-pointer transition">
//               Rooms
//             </li>
//             <li className="hover:text-white cursor-pointer transition">Spa</li>
//             <li className="hover:text-white cursor-pointer transition">
//               Dining
//             </li>
//             <li className="hover:text-white cursor-pointer transition">
//               Events
//             </li>
//           </ul>
//         </div>

//         <div>
//           <h4 className="uppercase text-xs mb-6 text-white tracking-widest">
//             Contact
//           </h4>
//           <div className="space-y-2 text-sm">
//             <p>Bhopal, MP</p>
//             <p>+91 98765 43210</p>
//             <p>info@The Galaxy.com</p>
//           </div>
//         </div>

//         <div>
//           <h4 className="uppercase text-xs mb-6 text-white tracking-widest">
//             Newsletter
//           </h4>
//           <input
//             type="email"
//             placeholder="Email address"
//             className="w-full bg-stone-900 border border-stone-800 px-4 py-2 text-sm focus:outline-none focus:border-amber-600 transition"
//           />
//         </div>
//       </div>

//       <div className="border-t border-stone-800 mt-16 pt-6 text-center text-xs opacity-50">
//         © 2026 The Galaxy Luxury Hotels. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-2xl font-serif text-white mb-4">The Galaxy</h3>
          <p className="text-sm opacity-70">
            Luxury hotel experience in the heart of nature.
          </p>
        </div>

        <div>
          <h4 className="uppercase text-xs mb-6 text-white tracking-widest">
            Navigation
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link 
                to="/rooms" 
                className="hover:text-white cursor-pointer transition block"
              >
                Rooms
              </Link>
            </li>
            <li>
              <Link 
                to="/spa" 
                className="hover:text-white cursor-pointer transition block"
              >
                Spa
              </Link>
            </li>
            <li>
              <Link 
                to="/dining" 
                className="hover:text-white cursor-pointer transition block"
              >
                Dining
              </Link>
            </li>
            <li>
              <Link 
                to="/events" 
                className="hover:text-white cursor-pointer transition block"
              >
                Events
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="uppercase text-xs mb-6 text-white tracking-widest">
            Contact
          </h4>
          <div className="space-y-2 text-sm">
            <p>Bhopal, MP</p>
            <p>+91 98765 43210</p>
            <p>info@The Galaxy.com</p>
          </div>
        </div>

        <div>
          <h4 className="uppercase text-xs mb-6 text-white tracking-widest">
            Newsletter
          </h4>
          <input
            type="email"
            placeholder="Email address"
            className="w-full bg-stone-900 border border-stone-800 px-4 py-2 text-sm focus:outline-none focus:border-amber-600 transition"
          />
        </div>
      </div>

      <div className="border-t border-stone-800 mt-16 pt-6 text-center text-xs opacity-50">
        © 2026 The Galaxy Luxury Hotels. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
