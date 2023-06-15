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

    public config: {count: number, total: number, need: number}[] = [
        {
            count: 2, // 每次游戏放入的物品数量
            total: 1, // 游戏次数
            need: 1 // 过关需要答对次数
        },
        {
            count: 3,
            total: 3,
            need: 3
        },
        {
            count: 4,
            total: 3,
            need: 2
        },
        {
            count: 5,
            total: 3,
            need: 2
        }
    ];

    public timeNum: number; // 记录每次答对用了多长时间
    public answers: number[][][]; // 每关答对用时
    public levelData: {count: number, total: number, need: number}; // 当前难度配置数据
    public levelCount: number = 3; // 一共几关
    public totalTime: number = 30; // 每道题倒计时秒数
    public curGameNum: number; // 当前游戏次数

    public init() {
        this.totalScore = 0;
        this.firstTaskSuccessCount = 0;
        this.firstTaskReaction = 0;
        this.secondTaskSuccessCount = 0;
        this.secondTaskReaction = 0;
        this.thirdTaskSuccessCount = 0;
        this.thirdTaskReaction = 0;
        this.LevelDifficultyEnd = 0;
        this.curGameNum = 0;

        this.answers = [];
        for (let i = 0; i < this.config.length; i++) {
            this.answers[i] = [];
            for (let j = 0; j < this.config[i].total; j++) {
                this.answers[i][j] = [];
            }
        }
        this.levelData = this.config[this.LevelDifficultyEnd];
    }

    public start() {
        this.timeNum = new Date().getTime();
    }

    public right() {
        let curTime = new Date().getTime();
        let second = Math.round((curTime - this.timeNum) / 1000);
        this.answers[this.LevelDifficultyEnd][this.curGameNum].push(second);
        this.start();
    }

    public wrong() {
        this.start();
    }

    public levelUp(): boolean {
        if (this.LevelDifficultyEnd < this.levelCount) {
            this.LevelDifficultyEnd++;
            this.levelData = this.config[this.LevelDifficultyEnd];
            this.curGameNum = 0;
            return true;
        } else {
            // this.allRight();
            return false;
        }
    }

    public resetGameNum() {
        this.curGameNum = 0;
    }

    public allRight() {
        for (let i = 1; i < this.answers.length; i++) {
            let answer = this.answers[i];
            let allTime: number = 0; // 总时间
            let allNum: number = 0; // 总次数
            for (let j = 0; j < answer.length; j++) {
                for (let a = 0; a < answer[j].length; a++) {
                    allNum++;
                    allTime += answer[j][a];
                }
            }
            if (i == 1) {
                this.firstTaskSuccessCount = allNum;
                this.firstTaskReaction = parseFloat((allTime / allNum).toFixed(2));
            } else if (i == 2) {
                this.secondTaskSuccessCount = allNum;
                this.secondTaskReaction = parseFloat((allTime / allNum).toFixed(2));
            } else if (i == 3) {
                this.thirdTaskSuccessCount = allNum;
                this.thirdTaskReaction = parseFloat((allTime / allNum).toFixed(2));
            }
        }
        GHttp.instance.upLoadGameData();
    }

    public getCurLevelIsRight(): boolean {
        let answer = this.answers[this.LevelDifficultyEnd];
        let config = this.config[this.LevelDifficultyEnd];

        let rightNum = 0;
        for (let i = 0; i < answer.length; i++) {
            if (answer[i].length >= config.count) {
                rightNum++;
            }
        }
        if (rightNum >= config.need){
            return true;
        } else {
            return false;
        }
    }

    public fail() {
        let answer = this.answers[this.LevelDifficultyEnd];
        for (let i = 0; i < answer.length; i++) {
            answer[i] = [];
        }
    }
}