import Cover from "./Cover";
import Drawer from "./Drawer";
import GHttp from "./GHttp";
import Model from "./Model";
import Result from "./Result";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    cabinet: cc.Node = null;

    @property(Result)
    result: Result = null;

    @property(cc.Node)
    cover: cc.Node = null;

    @property(cc.Sprite)
    article: cc.Sprite = null;

    @property(cc.Node)
    tipsPanel: cc.Node = null;

    @property(cc.Node)
    clickNode: cc.Node = null;

    @property([cc.SpriteFrame])
    articleSpriteFrames: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    articleLabels: cc.SpriteFrame[] = [];

    @property(cc.AudioClip)
    bankCardAudio: cc.AudioClip = null; // 银行卡

    @property(cc.AudioClip)
    keyAudio: cc.AudioClip = null; // 钥匙

    @property(cc.AudioClip)
    nailClippersAudio: cc.AudioClip = null; // 指甲钳

    @property(cc.AudioClip)
    paperAudio: cc.AudioClip = null; // 抽纸

    @property(cc.AudioClip)
    remoteControlAudio: cc.AudioClip = null; // 遥控器

    @property(cc.AudioClip)
    thermometerAudio: cc.AudioClip = null; // 体温计

    @property(cc.AudioClip)
    failAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    successAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    tips1Audio: cc.AudioClip = null;

    @property(cc.AudioClip)
    tips2Audio: cc.AudioClip = null;

    @property(cc.AudioClip)
    tips3Audio: cc.AudioClip = null;

    @property(cc.AudioClip)
    tips4Audio: cc.AudioClip = null;

    @property(cc.AudioClip)
    tips5Audio: cc.AudioClip = null;

    private curTime: number; // 当前剩余时间
    private articleIdArr: number[]; // 物品池
    public curClickNum: number; // 当前游戏点击次数
    private isClick: boolean; // 是否能点击抽屉（放东西的时候不能点）

    start() {
        GHttp.instance.login();

        this.init();
    }

    public init() {
        this.content.active = false;
        this.result.node.active = true;
        this.cover.active = true;
        this.clickNode.active = false;
        this.article.node.active = false;
        this.timeLabel.node.parent.active = false;
        this.isClick = false;
    }

    /** 开始游戏 */
    public startGame() {
        Model.instance.init();
        this.result.node.active = false;
        this.cover.active = false;
        this.content.active = true;
        this.showLianxi();
    }

    /** 显示联系模式界面 */
    public showLianxi() {
        Model.instance.resetGameNum();
        this.initCabinet();
        this.showTips(1);
        this.resetCurTime();
    }

    /** 重置倒计时 */
    public resetCurTime() {
        this.curTime = Model.instance.totalTime;
        this.stopTime();
    }

    /** 初始化柜子 */
    private initCabinet() {
        for (let i = 0; i < this.cabinet.childrenCount; i++) {
            let drawer: Drawer = this.cabinet.children[i].getComponent(Drawer);
            drawer.close();
            drawer.articleIndex = null;
        }
    }

    /** 显示顶部提示语 */
    private showTips(type: number, articleIndex: number = -1, cur: number = -1) {
        this.tipsPanel.active = true;
        let tips1 = this.tipsPanel.getChildByName("tips1");
        let tips2 = this.tipsPanel.getChildByName("tips2");
        let tips3 = this.tipsPanel.getChildByName("tips3");
        tips1.active = false;
        tips2.active = false;
        tips3.active = false;

        this.stopTime();
        this.isClick = false;

        if (type == 1) {
            tips1.active = true;
            this.clickNode.active = true;

            this.playAudio(this.tips1Audio, false, () => {
                this.playAudio(this.tips2Audio, false);
            })
        } else if (type == 2) {
            tips2.active = true;
            let t1 = cc.find("layout/tips1", tips2);
            let t2 = cc.find("layout/tips2", tips2);
            t1.active = cur <= 1;
            t2.active = cur > 1;
            let article: cc.Sprite = cc.find("layout/article", tips2).getComponent(cc.Sprite);
            article.spriteFrame = this.articleLabels[articleIndex];
            this.clickNode.active = false;

            let audio1 = cur <= 1 ? this.tips3Audio : this.tips4Audio;
            let audio2 = [this.bankCardAudio, this.keyAudio, this.nailClippersAudio, this.paperAudio, this.remoteControlAudio, this.thermometerAudio][articleIndex];
            this.playAudio(audio1, false, () => {
                this.playAudio(audio2, false);
            })
        } else if (type == 3) {
            tips3.active = true;
            this.clickNode.active = false;
            if (Model.instance.LevelDifficultyEnd > 0) {
                this.scheduleOnce(this.startTime, 3);
            }
            Model.instance.start();
            this.curClickNum = 0;

            this.scheduleOnce(() => this.isClick = true, 3); // 3秒后开始点击

            this.playAudio(this.tips5Audio);


            //test code
            let logStr = "格子物品数据： ";
            for (let i = 0; i < this.cabinet.childrenCount; i++) {
                let drawer = this.cabinet.children[i].getComponent(Drawer);
                drawer.node.name = `drawer_${i}`;
                logStr += drawer.node.name + " : " + drawer.articleIndex + ";\n";
            }
            console.log(logStr);
        }
    }

    /**
     * 播放音频
     * @param audio 
     * @param loop 
     * @param callback 
     */
    public playAudio(audio: cc.AudioClip, loop: boolean = false, callback: Function = null) {
        cc.audioEngine.stopAllEffects();
        let id = cc.audioEngine.playEffect(audio, loop);
        if (callback) {
            cc.audioEngine.setFinishCallback(id, callback);
        }
    }

    /** 点击屏幕 */
    clickStage() {
        let tips1 = this.tipsPanel.getChildByName("tips1");
        let tips2 = this.tipsPanel.getChildByName("tips2");
        let tips3 = this.tipsPanel.getChildByName("tips3");
        if (tips1.active) {
            this.articleIdArr = [0,1,2,3,4,5];
            this.lookArticles(1, Model.instance.levelData.count);
        } else if (tips2.active) {

        } else if (tips3.active) {

        }
    }

    /** 随机在抽屉里放物品的流程（关键） */
    lookArticles(cur: number, count: number) {
        let randomIndex = this.getRandomArticle();
        this.article.node.active = true;
        this.article.node.opacity = 255;
        this.article.node.x = 0;
        this.article.node.y = 320;
        this.article.spriteFrame = this.articleSpriteFrames[randomIndex];
        this.article.node.scale = 1;
        this.showTips(2, randomIndex, cur);

        let drawer = this.getRandomDrawer();
        drawer.articleIndex = randomIndex;

        cc.tween(this.article.node)
            .delay(1)
            .call(() => drawer.open())
            .to(1, { x: drawer.node.x, y: drawer.node.y + this.cabinet.y, scale: 0.5 })
            .to(1, { opacity: 0 })
            .call(() => {
                drawer.close();

                if (cur < count) {
                    this.lookArticles(++cur, count);
                } else {
                    this.showTips(3);
                }
            })
            .start()
    }

    /**
     * 随机获取一个物品id
     * @returns number
     */
    getRandomArticle(): number {
        let index = Math.round(Math.random() * (this.articleIdArr.length - 1));
        return this.articleIdArr.splice(index, 1)[0];
    }

    /**
     * 随机获取一个空抽屉
     * @returns Drawer
     */
    getRandomDrawer(): Drawer {
        let arr = this.cabinet.children.filter(item => item.getComponent(Drawer).articleIndex == null);
        if (arr && arr.length > 0) {
            let index = Math.round(Math.random() * (arr.length - 1));
            return arr[index].getComponent(Drawer);
        }
        return null;
    }

    /** 开始倒计时 */
    private startTime() {
        this.tipsPanel.active = false;

        this.timeLabel.node.parent.active = true;
        this.timeLabel.string = this.curTime + "秒";
        this.schedule(this.updateTime, 1, this.curTime, 1);
        Model.instance.start();
    }

    /** 刷新倒计时 */
    private updateTime() {
        if (this.curTime > 0) {
            this.curTime--;
            this.timeLabel.string = this.curTime + "秒";
        } else {
            this.unschedule(this.updateTime);
            this.result.showFail();
        }
    }

    /** 停止倒计时 */
    public stopTime() {
        this.unschedule(this.updateTime);
        this.timeLabel.node.parent.active = false;
    }

    /** 检查游戏次数 */
    checkGame() {
        this.curClickNum++; // 每点击一次点击次数+1

        this.isClick = false;
        this.scheduleOnce(() => this.isClick = true, 1);

        let qIndex = `${Model.instance.LevelDifficultyEnd}/${Model.instance.levelCount}`;
        let gameNum = `${Model.instance.curGameNum + 1}/${Model.instance.levelData.total}`;
        let clickNum = `${this.curClickNum}/${Model.instance.levelData.count}`;
        let str = `第${qIndex}题，第${gameNum}次游戏，第${clickNum}次点击`;
        console.log(str);
    }

    /** 检查结果（关键） */
    checkResult() {
        if (this.curClickNum >= Model.instance.levelData.count) {
            Model.instance.curGameNum++; // 每点击 Model.instance.levelData.count 次，游戏次数+1
            this.initCabinet();

            if (Model.instance.curGameNum >= Model.instance.levelData.total) {
                if (Model.instance.answers[Model.instance.LevelDifficultyEnd]) {
                    if (Model.instance.getCurLevelIsRight()) {
                        if (Model.instance.LevelDifficultyEnd == 0) { // 练习模式
                            this.result.showRight();
                        } else if (Model.instance.LevelDifficultyEnd == 3) { // 通关
                            this.result.showAllRight();
                            Model.instance.allRight();
                        } else {
                            this.result.showLevelUp_2();
                        }
                    } else {
                        if (Model.instance.LevelDifficultyEnd == 0) {
                            this.result.showWrong();
                        } else {
                            this.result.showFail();
                        }
                    }
                }
            } else {
                this.showTips(1);
            }
        }
    }

    /** 是否能点击（做延迟点击用的，留给提示语播放的时间） */
    checkIsClick(): boolean {
        return this.isClick && (this.curClickNum < Model.instance.levelData.count);
    }
}
