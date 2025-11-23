import React from "react";
import TitleText from "./titleText";
import Card from "./Card";

import productImage1 from "../public/image/cardManImage/womanImage.jpg";
import productImage2 from "../public/image/cardManImage/ImageWithFallback.png";
import productImage3 from "../public/image/cardManImage/image 13.png";
import productImage4 from "../public/image/cardManImage/productImage.jpg";

const CollectionSections = () => {
  const cardWrapperClasses =
    "w-full max-w-sm sm:w-[calc(50%-1.5rem)] md:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] xl:w-[calc(25%-1.5rem)]";

  return (
    <>
      {/* Outer container for centering and padding */}
      <div className="container mx-auto px-4">
        <TitleText />

        {/* Responsive Card Layout Container (4 Cards) */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-4 xl:gap-6 mt-10">
          {/* Card 1 Wrapper (Trending) */}
          <div className={cardWrapperClasses}>
            <Card
              image={productImage2.src}
              tranding={1}
              title="Man’s Collections"
              dis="Sophisticated designs for the modern women"
              productNumber={48}
              ageGroup={20}
              ageValue={true}
            />
          </div>

          {/* Card 2 Wrapper */}
          <div className={cardWrapperClasses}>
            <Card
              image={productImage1.src}
              tranding={1}
              title="Women’s Collections"
              dis="Elegant designs for the contemporary woman"
              productNumber={55}
              ageGroup={30}
              ageValue={true}
            />
          </div>

          {/* Card 3 Wrapper */}

          <div className={cardWrapperClasses}>
            <Card
              image={productImage3.src}
              tranding={1}
              title="Kid’s Collections"
              dis="Stylish designs for children"
              productNumber={88}
              ageGroup={4}
              ageValue={true}
            />
          </div>

          {/* Card 4 Wrapper */}

          <div className={cardWrapperClasses}>
            <Card
              image={productImage4.src}
              tranding={1}
              title="Other Products Collections"
              dis="Exclusive designs for every collection"
              productNumber={88}
              ageGroup={-1}
              ageValue={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionSections;
