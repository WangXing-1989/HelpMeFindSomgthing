import Main from "./Main";
import Model from "./Model";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Drawer extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    rightNode: cc.Node = null;

    @property(cc.Node)
    wrongNode: cc.Node = null;

    main: Main;
    articleIndex: number = null; // 物品id (索引) [银行卡，钥匙，指甲钳，抽纸，遥控器，体温计]

    protected start(): void {
        this.main = cc.find("Canvas").getComponent(Main);

        this.rightNode.active = false;
        this.wrongNode.active = false;
    }

    clickSelf() {
        if (!this.main.checkIsClick()) {
            return;
        }
        
        this.open();
        
        if (this.articleIndex) {
            this.showArticle();
            this.right();
        } else {
            this.wrong();
        }

        this.main.checkGame();
    }

    open() {
        this.icon.active = true;
    }

    close() {
        this.icon.active = false;
    }

    showArticle() {
        this.main.article.node.active = true;
        this.main.article.spriteFrame = this.main.articleSpriteFrames[this.articleIndex];
        this.main.article.node.scale = 0.5;
        this.main.article.node.x = this.node.x;
        this.main.article.node.y = this.node.y + this.main.cabinet.y;
        this.main.article.node.opacity = 255;
    }

    hideArticle() {
        this.main.article.node.active = false;
    }

    right() {
        this.rightNode.active = true;
        this.rightNode.x = 0;
        this.rightNode.y = 0;
        let spine = this.rightNode.getChildByName("spine").getComponent(sp.Skeleton);
        spine.setAnimation(0, "shibiemubiao", false);
        cc.tween(this.rightNode)
            .by(0.7, { y: 150 })
            .call(() => {
                this.rightNode.active = false;
                this.hideArticle();
                this.close();
                this.main.checkResult();
            })
            .start();

        Model.instance.right();
        this.articleIndex = null;
    }

    wrong() {
        this.wrongNode.active = true;
        this.wrongNode.x = 0;
        this.wrongNode.y = 0;
        cc.tween(this.wrongNode)
            .by(0.7, { y: 150 })
            .call(() => {
                this.wrongNode.active = false;
                this.close();
                this.main.checkResult();
            })
            .start();

        Model.instance.wrong();
    }
}
