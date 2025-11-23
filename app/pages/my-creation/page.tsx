import React from "react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MyCreationBody from "@/app/pages/my-creation/myCreationBody";

const page = () => {
  return (
    <>
      <Navbar />
      <MyCreationBody />
      <Footer />
    </>
  );
};

export default page;
