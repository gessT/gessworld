import CardContainer from "@/components/card-container";
import { User } from "lucide-react";

const AboutCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-8 md:p-12 gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 dark:bg-red-500/10 p-2.5 rounded-xl">
            <User className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">About</h1>
        </div>
        <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed">
          <div className="about-snaptogoclub">
            <h2>关于 snaptogoclub</h2>
            <p>
              snaptogoclub，是我想打造的一个
              <strong>「边走、边拍、边生活」</strong>
              的旅行体验品牌。我相信，每一次旅行，不只是去一个地方，而是一张张被捕捉的光影、一段段被留下的故事。
            </p>

            <p>
              在这里，我不会把自己称为导游。
              我更像是一个 <strong>旅行同行者、摄影记录者、旅拍创作者</strong>。
              我带着小队，一起探索、一起创作，
              用最轻松的方式，让大家在旅途中留下最好看的自己，也找到属于自己的风景。
            </p>

            <p>
              无论是情侣旅拍、小团队旅行、还是想学习摄影的朋友，
              我都希望 snaptogoclub 能成为你
              <strong>出发的理由与勇气</strong>。
              带着镜头走，带着故事回家——这，就是 snaptogoclub 想要分享的旅行方式。
            </p>
          </div>

        </div>
      </div>
    </CardContainer>
  );
};

export default AboutCard;
