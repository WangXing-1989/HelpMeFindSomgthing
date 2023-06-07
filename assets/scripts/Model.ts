import GHttp from "./GHttp";

export default class Model {
    private static _instance: Model = null;
    public static get instance(): Model {
        if (!this._instance) {
            this._instance = new Model();
        }
        return this._instance;
    }

    public totalScore: number; // 总得分 
    public firstTaskSuccessCount: number; // 任务1用户完成正确次数
    public firstTaskReaction: number; // 任务1用户正确反应时
    public secondTaskSuccessCount: number; // 任务2用户完成正确次数
    public secondTaskReaction: number; // 任务2用户正确反应时
    public thirdTaskSuccessCount: number; // 任务3用户完成正确次数
    public thirdTaskReaction: number; // 任务3用户正确反应时
    public LevelDifficultyEnd: number; // 结束时所处难度水平

    public config: {total: number, need: number}[] = [
        {
            total: 2,
            need: 2
        },
        {
            total: 3,
            need: 3
        },
        {
            total: 2,
            need: 2
        },
        {
            total: 2,
            need: 2
        }
    ];

    public timeNum: number;
    public answers: number[][];
    public levelData: {total: number, need: number};
    public levelCount: number = 3;

    public init() {
        this.totalScore = 0;
        this.firstTaskSuccessCount = 0;
        this.firstTaskReaction = 0;
        this.secondTaskSuccessCount = 0;
        this.secondTaskReaction = 0;
        this.thirdTaskSuccessCount = 0;
        this.thirdTaskReaction = 0;
        this.LevelDifficultyEnd = 0;

        this.answers = [[], [], [], []];
        this.levelData = this.config[this.LevelDifficultyEnd];
    }

    public start() {
        this.timeNum = new Date().getTime();
    }

    public right() {
        let curTime = new Date().getTime();
        let second = Math.round((curTime - this.timeNum) / 1000);
        this.answers[this.LevelDifficultyEnd].push(second);
    }

    public wrong() {

    }

    public levelUp() {
        if (this.LevelDifficultyEnd < this.levelCount) {
            this.LevelDifficultyEnd++;
        } else {
            this.allRight();
        }
    }

    public allRight() {
        for (let i = 1; i < this.answers.length; i++) {
            let answer = this.answers[i];
            let allTime: number = 0;
            for (let j = 0; j < answer.length; j++) {
                allTime += answer[j];
            }
            if (i == 1) {
                this.firstTaskSuccessCount = answer.length;
                this.firstTaskReaction = parseFloat((allTime / answer.length).toFixed(2));
            } else if (i == 2) {
                this.secondTaskSuccessCount = answer.length;
                this.secondTaskReaction = parseFloat((allTime / answer.length).toFixed(2));
            } else if (i == 3) {
                this.thirdTaskSuccessCount = answer.length;
                this.thirdTaskReaction = parseFloat((allTime / answer.length).toFixed(2));
            }
        }
        GHttp.instance.upLoadGameData();
    }
}