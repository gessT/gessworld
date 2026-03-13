import CardContainer from "@/components/card-container";

const CameraCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-12 gap-[128px]">
        <div className="flex flex-col text-3xl">
          <h1>Camera</h1>
          <h1>& Camera Lenses</h1>
        </div>

        <div className="mt-5 text-base sm:text-lg md:text-xl text-white/75 max-w-lg leading-relaxed font-medium drop-shadow text-center">
              <p className="text-4xl md:text-5xl font-semibold tracking-wide leading-tight text-white">
                旅行 × 攝影 × 社交
              </p>
              <p className="text-lg text-white/60 leading-relaxed font-light mt-3">
                我們一起旅行，一起創作，一起記錄世界。
              </p>
            </div>
      </div>
    </CardContainer>
  );
};

export default CameraCard;
