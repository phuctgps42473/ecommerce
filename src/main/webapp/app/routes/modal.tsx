import { useNavigate, useLocation, Outlet } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";

export default function ModalLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const closeModal = () => navigate(-1);

  return (
    <AnimatePresence>
      {location.state?.modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
          >
            <button className="absolute top-2 right-2 text-gray-500" onClick={closeModal}>
              &times;
            </button>
            <Outlet />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
