import Main from "./Main";
import Model from "./Model";

const {ccclass, property} = cc._decorator;

/**
 * 抽屉类
 */
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

    /**
     * 点击抽屉
     * @returns 
     */
    clickSelf() {
        if (!this.main.checkIsClick()) {
            return;
        }

        console.log(`点击了：${this.node.name} : ${this.articleIndex}`);

        this.main.checkGame();
        
        this.open();
        
        if (this.articleIndex != null) {
            this.showArticle();
            this.right();
        } else {
            this.wrong();
        }


        console.log(`当前answer : ${Model.instance.answers}`);
    }

    /** 打开抽屉 */
    open() {
        this.icon.active = true;
    }

    /** 关闭抽屉 */
    close() {
        this.icon.active = false;
    }
    
    /** 显示抽屉里的物品（如果有的话） */
    showArticle() {
        this.main.article.node.active = true;
        this.main.article.spriteFrame = this.main.articleSpriteFrames[this.articleIndex];
        this.main.article.node.scale = 0.5;
        this.main.article.node.x = this.node.x;
        this.main.article.node.y = this.node.y + this.main.cabinet.y;
        this.main.article.node.opacity = 255;
    }

    /** 隐藏抽屉里的物品 */
    hideArticle() {
        this.main.article.node.active = false;
    }

    /** 正确（抽屉里有东西） */
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

    /** 错误（抽屉里没有东西） */
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
