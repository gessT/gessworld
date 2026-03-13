import CardContainer from "@/components/card-container";

const CameraCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-12 gap-[128px]">
        <div className="flex flex-col text-3xl">
          <h1>Camera</h1>
          <h1>& Camera Lenses</h1>
        </div>

        <div className="font-light">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-wide leading-tight">
    旅行 × 攝影 × 社交
  </h1>

  <p className="text-lg text-muted-foreground leading-relaxed font-light">
    我們一起旅行，一起創作，一起記錄世界。
  </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default CameraCard;
