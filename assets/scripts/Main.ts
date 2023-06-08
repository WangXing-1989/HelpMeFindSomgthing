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

    private curTime: number; // 当前剩余时间

    start() {
        GHttp.instance.login();

        this.content.active = false;
        this.result.node.active = true;
        this.cover.active = true;
        this.clickNode.active = false;
        this.article.node.active = false;
        this.timeLabel.node.parent.active = false;
    }

    public startGame() {
        Model.instance.init();
        this.cover.active = false;
        this.content.active = true;
        this.showLianxi();
    }

    private showLianxi() {
        this.initCabinet();
        this.showTips(1);
    }

    /** 初始化柜子 */
    private initCabinet() {
        for (let i = 0; i < this.cabinet.childrenCount; i++) {
            let drawer: Drawer = this.cabinet.children[i].getComponent(Drawer);
            drawer.close();
            drawer.articleIndex = null;
        }
    }

    private showTips(type: number, articleIndex: number = -1) {
        this.tipsPanel.active = true;
        let tips1 = this.tipsPanel.getChildByName("tips1");
        let tips2 = this.tipsPanel.getChildByName("tips2");
        let tips3 = this.tipsPanel.getChildByName("tips3");
        tips1.active = false;
        tips2.active = false;
        tips3.active = false;

        if (type == 1) {
            tips1.active = true;
            this.clickNode.active = true;
        } else if (type == 2) {
            tips2.active = true;
            let article: cc.Sprite = cc.find("layout/article", tips2).getComponent(cc.Sprite);
            article.spriteFrame = this.articleLabels[articleIndex];
            this.clickNode.active = false;
        } else if (type == 3) {
            tips3.active = true;
            this.clickNode.active = false;
            this.scheduleOnce(this.startTime, 3);
        }
    }

    clickStage() {
        let tips1 = this.tipsPanel.getChildByName("tips1");
        let tips2 = this.tipsPanel.getChildByName("tips2");
        let tips3 = this.tipsPanel.getChildByName("tips3");
        if (tips1.active) {
            this.lookArticles(Model.instance.levelData.count);
        } else if (tips2.active) {

        } else if (tips3.active) {

        }
    }

    lookArticles(count: number) {
        let randomIndex = Math.round(Math.random() * (this.articleSpriteFrames.length - 1));
        this.article.node.active = true;
        this.article.node.opacity = 255;
        this.article.node.x = 0;
        this.article.node.y = 320;
        this.article.spriteFrame = this.articleSpriteFrames[randomIndex];
        this.article.node.scale = 1;
        this.showTips(2, randomIndex);

        let drawer = this.getRandomDrawer();
        drawer.articleIndex = randomIndex;

        cc.tween(this.article.node)
            .delay(1)
            .call(() => drawer.open())
            .to(1, { x: drawer.node.x, y: drawer.node.y + this.cabinet.y, scale: 0.5 })
            .to(1, { opacity: 0 })
            .call(() => {
                drawer.close();

                if (count > 0) {
                    this.lookArticles(--count);
                } else {
                    this.showTips(3);
                }
            })
            .start()
    }

    /**
     * 随机获取一个空抽屉
     * @returns Drawer
     */
    getRandomDrawer(): Drawer {
        let arr = this.cabinet.children.filter(item => !item.getComponent(Drawer).articleIndex);
        if (arr && arr.length > 0) {
            let index = Math.round(Math.random() * (arr.length - 1));
            return arr[index].getComponent(Drawer);
        }
        return null;
    }

    private startTime() {
        this.curTime = Model.instance.totalTime;
        this.timeLabel.node.parent.active = true;
        this.timeLabel.string = this.curTime + "秒";
        this.schedule(this.updateTime, 1, this.curTime, 1);
        Model.instance.start();
    }

    private updateTime() {
        if (this.curTime > 0) {
            this.curTime--;
            this.timeLabel.string = this.curTime + "秒";
        } else {
            this.unschedule(this.updateTime);
            this.result.showFail();
        }
    }
}
