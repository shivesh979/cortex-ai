import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  X
} from "lucide-react";
import { useEffect } from "react";
export default function AIBanner({
  open,
  title,
  message,
  onClose
}) {

    useEffect(()=>{

  if(!open) return;

  const timer=setTimeout(()=>{

      onClose();

  },5000);

  return ()=>clearTimeout(timer);

},[open]);

  return (

    <AnimatePresence>

      {open && (

        <motion.div

          initial={{
            y: -30,
            opacity: 0
          }}

          animate={{
            y: 0,
            opacity: 1
          }}

          exit={{
            y: -30,
            opacity: 0
          }}

          transition={{
            duration: .2
          }}

          className="fixed top-[max(1.25rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-[999] w-[92%] max-w-xl"

        >

          <div className="rounded-2xl border border-[#404040] bg-[#111111] shadow-2xl overflow-hidden">

            <div className="h-1 bg-white/20" />

            <div className="flex items-start gap-4 p-5">

              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">

                <AlertTriangle
                  size={20}
                  className="text-white"
                />

              </div>

              <div className="flex-1">

                <h3 className="text-white font-semibold text-[15px]">

                  {title}

                </h3>

                <p className="mt-1 text-neutral-500 text-sm leading-6">

                  {message}

                </p>

              </div>

              <button

                onClick={onClose}

                className="text-neutral-500 hover:text-white"

              >

                <X size={18} />

              </button>

            </div>

          </div>

        </motion.div>

      )}

    </AnimatePresence>

  );

}