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
          <p>
          A Social Travel Photography Community
We travel together. We create together.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default CameraCard;
