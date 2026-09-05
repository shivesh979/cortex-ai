import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaGoogle } from "react-icons/fa";
import ArtifactPanel from "../components/ArtifactPanel";
import ChatArea from "../components/ChatArea";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";
import { setUserData } from "../redux/user.slice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";

function Home() {
  const { userData } = useSelector(state => state.user);
  const dispatch=useDispatch()
  const [authError, setAuthError] = useState("");
const login=async (token)=>{
  try {
    const {data}=await api.post(`/api/auth/login`,{token})
    dispatch(setUserData(data.user))
  } catch (error) {
    console.log(error)
    setAuthError(
      error?.response?.data?.message ||
      error?.message ||
      "Backend login failed"
    );
  }
}
  const handleGoogleLogin =async () => {
   try {
     setAuthError("");
     const result =
     await signInWithPopup(auth,googleProvider);

     const token =await result.user.getIdToken();
     await login(token)
   } catch (error) {
     console.log(error);
     setAuthError(`${error?.code || "auth/error"}: ${error?.message || error}`);
   }
  };

  return (
<div className="app-shell flex bg-[#0A0A0A] text-white overflow-hidden">
      <Sidebar />
      <ChatArea />
      <ArtifactPanel />

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">
          <div className="w-full max-w-[340px] bg-[#111111] border border-[#262626] rounded-2xl p-5 sm:p-7 flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-white tracking-tight">Welcome to CortexAI</h2>
              <p className="text-[13px] text-neutral-500">Please login to continue using the app.</p>
            </div>

            <button
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black bg-white hover:bg-neutral-200 active:bg-neutral-200 border border-white transition-colors duration-150 cursor-pointer"
>
  <FaGoogle size={15} className="text-black" />
  Continue with Google
</button>

            {authError && (
              <p className="text-[12px] text-red-400 break-words">{authError}</p>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default Home;