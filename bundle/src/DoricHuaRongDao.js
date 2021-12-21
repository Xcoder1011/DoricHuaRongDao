'use strict';

var doric = require('doric');

var LayoutSpec;
(function (LayoutSpec) {
    /**
     * Depends on what's been set on width or height.
    */
    LayoutSpec[LayoutSpec["JUST"] = 0] = "JUST";
    /**
     * Depends on it's content.
     */
    LayoutSpec[LayoutSpec["FIT"] = 1] = "FIT";
    /**
     * Extend as much as parent let it take.
     */
    LayoutSpec[LayoutSpec["MOST"] = 2] = "MOST";
})(LayoutSpec || (LayoutSpec = {}));
class LayoutConfigImpl {
    fit() {
        this.widthSpec = LayoutSpec.FIT;
        this.heightSpec = LayoutSpec.FIT;
        return this;
    }
    fitWidth() {
        this.widthSpec = LayoutSpec.FIT;
        return this;
    }
    fitHeight() {
        this.heightSpec = LayoutSpec.FIT;
        return this;
    }
    most() {
        this.widthSpec = LayoutSpec.MOST;
        this.heightSpec = LayoutSpec.MOST;
        return this;
    }
    mostWidth() {
        this.widthSpec = LayoutSpec.MOST;
        return this;
    }
    mostHeight() {
        this.heightSpec = LayoutSpec.MOST;
        return this;
    }
    just() {
        this.widthSpec = LayoutSpec.JUST;
        this.heightSpec = LayoutSpec.JUST;
        return this;
    }
    justWidth() {
        this.widthSpec = LayoutSpec.JUST;
        return this;
    }
    justHeight() {
        this.heightSpec = LayoutSpec.JUST;
        return this;
    }
    configWidth(w) {
        this.widthSpec = w;
        return this;
    }
    configHeight(h) {
        this.heightSpec = h;
        return this;
    }
    configMargin(m) {
        this.margin = m;
        return this;
    }
    configAlignment(a) {
        this.alignment = a;
        return this;
    }
    configWeight(w) {
        this.weight = w;
        return this;
    }
    configMaxWidth(v) {
        this.maxWidth = v;
        return this;
    }
    configMaxHeight(v) {
        this.maxHeight = v;
        return this;
    }
    configMinWidth(v) {
        this.minWidth = v;
        return this;
    }
    configMinHeight(v) {
        this.minHeight = v;
        return this;
    }
    toModel() {
        return {
            widthSpec: this.widthSpec,
            heightSpec: this.heightSpec,
            margin: this.margin,
            alignment: this.alignment ? this.alignment.toModel() : undefined,
            weight: this.weight,
        };
    }
}
function layoutConfig() {
    return new LayoutConfigImpl;
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const kMenuWidth = Math.floor((Environment.screenWidth - 60) / 4);
const kWidth = 4 * kMenuWidth;
const kHeight = 5 * kMenuWidth;
const kGameProgressKey = "kGameProgressKey";
const buttonColor = doric.Color.parse("#A0522D");
const colors = [
    doric.Color.parse("#339999"),
    doric.Color.parse("#CC3333"),
    doric.Color.parse("#FF9999"),
    doric.Color.parse("#CCCC00"),
    doric.Color.parse("#9999FF"),
    doric.Color.parse("#CC6699"),
    doric.Color.parse("#666699"),
    doric.Color.parse("#0099CC"),
];
let DoricHuaRongDao = class DoricHuaRongDao extends doric.Panel {
    constructor() {
        super(...arguments);
        // 数据源
        this.dataModel = {};
        this.btnEnabled = true;
        this.responsedGesture = false;
    }
    // 检测人物是否能向该方向移动
    // direction: 1 left, 2 right, 3 top, 4 top
    checkRoleCanMoveToDirection(index, direction, view) {
        const it = this.dataModel;
        if (!it ||
            !this.roleViews ||
            !it.rolePositions ||
            this.roleViews.length != it.rolePositions.length)
            return false;
        const item = it.rolePositions[index];
        var X = 0;
        var Y = 0;
        switch (direction) {
            case 1:
                {
                    // 向左边
                    X = (item.origin.x - 1) * kMenuWidth;
                    Y = item.origin.y * kMenuWidth;
                }
                break;
            case 2:
                {
                    // 向右边
                    X = (item.origin.x + 1) * kMenuWidth;
                    Y = item.origin.y * kMenuWidth;
                }
                break;
            case 3:
                {
                    // 向上
                    X = item.origin.x * kMenuWidth;
                    Y = (item.origin.y - 1) * kMenuWidth;
                }
                break;
            case 4:
                {
                    // 向下
                    X = item.origin.x * kMenuWidth;
                    Y = (item.origin.y + 1) * kMenuWidth;
                }
                break;
        }
        var width = Math.floor(item.type / 10) * kMenuWidth;
        var height = (item.type % 10) * kMenuWidth;
        var maxX = X + width;
        var maxY = Y + height;
        // 找到不可以移动的场景
        if (X < 0 || Y < 0) {
            return false;
        }
        if (maxX > kWidth || maxY > kHeight) {
            return false;
        }
        for (let index = 0; index < it.rolePositions.length; index++) {
            const element = it.rolePositions[index];
            if (element.name == item.name)
                continue;
            var elementX = element.origin.x * kMenuWidth;
            var elementY = element.origin.y * kMenuWidth;
            var elementWidth = Math.floor(element.type / 10) * kMenuWidth;
            var elementHeight = (element.type % 10) * kMenuWidth;
            var emaxX = elementX + elementWidth;
            var emaxY = elementY + elementHeight;
            if (emaxX > X && elementX < maxX && emaxY > Y && elementY < maxY) {
                return false;
            }
        }
        const duration = 150;
        switch (direction) {
            case 1:
                {
                    // 向左边
                    doric.animate(this.context)({
                        animations: () => {
                            view.x -= kMenuWidth;
                        },
                        duration: duration,
                    }).then(() => {
                        var _a;
                        item.origin.x -= 1;
                        (_a = it.steps) === null || _a === void 0 ? void 0 : _a.push({
                            direction: direction,
                            roleName: item.name,
                            desc: `${item.name}-向左`,
                            index: index,
                        });
                        this.judgeUserIsWin(item);
                    });
                }
                break;
            case 2:
                {
                    // 向右边
                    doric.animate(this.context)({
                        animations: () => {
                            view.x += kMenuWidth;
                        },
                        duration: duration,
                    }).then(() => {
                        var _a;
                        item.origin.x += 1;
                        (_a = it.steps) === null || _a === void 0 ? void 0 : _a.push({
                            direction: direction,
                            roleName: item.name,
                            desc: `${item.name}-向右`,
                            index: index,
                        });
                        this.judgeUserIsWin(item);
                    });
                }
                break;
            case 3:
                {
                    // 向上
                    doric.animate(this.context)({
                        animations: () => {
                            view.y -= kMenuWidth;
                        },
                        duration: duration,
                    }).then(() => {
                        var _a;
                        item.origin.y -= 1;
                        (_a = it.steps) === null || _a === void 0 ? void 0 : _a.push({
                            direction: direction,
                            roleName: item.name,
                            desc: `${item.name}-向上`,
                            index: index,
                        });
                        this.judgeUserIsWin(item);
                    });
                }
                break;
            case 4:
                {
                    // 向下
                    doric.animate(this.context)({
                        animations: () => {
                            view.y += kMenuWidth;
                        },
                        duration: duration,
                    }).then(() => {
                        var _a;
                        item.origin.y += 1;
                        (_a = it.steps) === null || _a === void 0 ? void 0 : _a.push({
                            direction: direction,
                            roleName: item.name,
                            desc: `${item.name}-向下`,
                            index: index,
                        });
                        this.judgeUserIsWin(item);
                    });
                }
                break;
        }
        return true;
    }
    // 判断是否获胜
    judgeUserIsWin(moveItem) {
        if (moveItem && moveItem.name == "曹操") {
            if (moveItem.origin.x == 1 && moveItem.origin.y == 3) {
                doric.modal(this.context)
                    .confirm({
                    title: "YOU WIN!",
                    msg: "恭喜您获胜！是否查看获胜步骤？",
                    okLabel: "查看",
                    cancelLabel: "取消",
                })
                    .then(() => {
                    var _a;
                    // OK 查看
                    const it = this.dataModel;
                    var str = "";
                    (_a = it.steps) === null || _a === void 0 ? void 0 : _a.forEach((step, index) => {
                        str = str + step.desc + ",";
                    });
                    doric.log(`获胜步骤为：${str}`);
                    doric.modal(this.context).confirm({
                        title: "获胜步骤",
                        msg: str,
                        okLabel: "分享",
                        cancelLabel: "取消",
                    });
                }, () => {
                    // Cancel 取消
                });
            }
        }
    }
    resetSubViewsFrame(state) {
        if (this.roleViews) {
            this.roleViews.forEach((view, index) => {
                if (this.roleViews &&
                    state.rolePositions &&
                    this.roleViews.length == state.rolePositions.length) {
                    const item = state.rolePositions[index];
                    if (item) {
                        view.y = item.origin.y * kMenuWidth;
                        view.x = item.origin.x * kMenuWidth;
                    }
                }
            });
            this.attached(state, this);
        }
    }
    attached(state, vh) {
        if (!state)
            return;
        vh.backBtn.onClick = () => {
            const it = this.dataModel;
            const steps = it.steps;
            if (!it ||
                !steps ||
                !vh.roleViews ||
                !it.rolePositions ||
                vh.roleViews.length != it.rolePositions.length)
                return;
            if (steps.length == 0) {
                doric.modal(this.context).toast("已回到游戏开始阶段");
            }
            else {
                if (!this.btnEnabled)
                    return;
                this.btnEnabled = false;
                const step = steps[steps.length - 1];
                const duration = 150;
                const item = it.rolePositions[step.index];
                const view = vh.roleViews[step.index];
                setTimeout(() => {
                    this.btnEnabled = true;
                }, 200);
                switch (step.direction) {
                    case 1:
                        {
                            // 向左边
                            doric.animate(this.context)({
                                animations: () => {
                                    view.x += kMenuWidth;
                                },
                                duration: duration,
                            }).then(() => {
                                var _a;
                                item.origin.x += 1;
                                (_a = it.steps) === null || _a === void 0 ? void 0 : _a.pop();
                            });
                        }
                        break;
                    case 2:
                        {
                            // 向右边
                            doric.animate(this.context)({
                                animations: () => {
                                    view.x -= kMenuWidth;
                                },
                                duration: duration,
                            }).then(() => {
                                var _a;
                                item.origin.x -= 1;
                                (_a = it.steps) === null || _a === void 0 ? void 0 : _a.pop();
                            });
                        }
                        break;
                    case 3:
                        {
                            // 向上
                            doric.animate(this.context)({
                                animations: () => {
                                    view.y += kMenuWidth;
                                },
                                duration: duration,
                            }).then(() => {
                                var _a;
                                item.origin.y += 1;
                                (_a = it.steps) === null || _a === void 0 ? void 0 : _a.pop();
                            });
                        }
                        break;
                    case 4:
                        {
                            // 向下
                            doric.animate(this.context)({
                                animations: () => {
                                    view.y -= kMenuWidth;
                                },
                                duration: duration,
                            }).then(() => {
                                var _a;
                                item.origin.y -= 1;
                                (_a = it.steps) === null || _a === void 0 ? void 0 : _a.pop();
                            });
                        }
                        break;
                }
            }
        };
        /// 保存进度
        vh.saveBtn.onClick = () => {
            const it = this.dataModel;
            doric.storage(this.context)
                .setItem(kGameProgressKey, JSON.stringify(it))
                .then(() => {
                doric.modal(this.context).toast("保存成功");
            });
        };
        /// 重新开始
        vh.rePlayBtn.onClick = () => {
            doric.modal(this.context)
                .confirm({
                title: "温馨提示",
                msg: "您确定要重新开始吗？",
                okLabel: "确定",
                cancelLabel: "取消",
            })
                .then(() => {
                // OK 确定
                this.reset(state);
                doric.animate(this.context)({
                    animations: () => {
                        this.resetSubViewsFrame(state);
                    },
                    duration: 300,
                });
            });
        };
    }
    // 重置
    reset(it) {
        it.steps = [];
        it.rolePositions = [
            {
                name: "张飞",
                type: 12,
                origin: { x: 0, y: 0 },
                photoPath: "assets/pic11.png",
            },
            {
                name: "曹操",
                type: 22,
                origin: { x: 1, y: 0 },
                photoPath: "assets/pic0.png",
            },
            {
                name: "赵云",
                type: 12,
                origin: { x: 3, y: 0 },
                photoPath: "assets/pic10.png",
            },
            {
                name: "黄忠",
                type: 12,
                origin: { x: 0, y: 2 },
                photoPath: "assets/pic14.png",
            },
            {
                name: "关羽",
                type: 21,
                origin: { x: 1, y: 2 },
                photoPath: "assets/pic3.png",
            },
            {
                name: "马超",
                type: 12,
                origin: { x: 3, y: 2 },
                photoPath: "assets/pic13.png",
            },
            {
                name: "卒1",
                type: 11,
                origin: { x: 1, y: 3 },
                photoPath: "assets/pic6.png",
            },
            {
                name: "卒2",
                type: 11,
                origin: { x: 2, y: 3 },
                photoPath: "assets/pic6.png",
            },
            {
                name: "卒3",
                type: 11,
                origin: { x: 0, y: 4 },
                photoPath: "assets/pic6.png",
            },
            {
                name: "卒4",
                type: 11,
                origin: { x: 3, y: 4 },
                photoPath: "assets/pic6.png",
            },
        ];
    }
    build(rootView) {
        const state = this.dataModel;
        if (!state || !state.rolePositions)
            return;
        doric.vlayout([
            doric.text({
                text: "三国华容道",
                textColor: buttonColor,
                fontStyle: "bold",
                textSize: 20,
                layoutConfig: layoutConfig()
                    .fit()
                    .configAlignment(doric.Gravity.Center)
                    .configMargin({ top: 30 }),
            }),
            doric.stack([
                ...(this.roleViews = state.rolePositions.map((item, index) => {
                    var view = doric.gestureContainer(doric.image({
                        image: Environment.platform === "Android"
                            ? new doric.AndroidAssetsResource(item.photoPath)
                            : new doric.MainBundleResource(item.photoPath),
                        layoutConfig: layoutConfig().most(),
                        scaleType: doric.ScaleType.ScaleAspectFill,
                    }), {
                        backgroundColor: colors[index % colors.length],
                        layoutConfig: layoutConfig().just(),
                        top: item.origin.y * kMenuWidth,
                        left: item.origin.x * kMenuWidth,
                        width: Math.floor(item.type / 10) * kMenuWidth,
                        height: (item.type % 10) * kMenuWidth,
                        onPan: (dx, dy) => {
                            if (!this.responsedGesture) {
                                //direction: 1 left, 2 right, 3 top, 4 bottom
                                if (dx > 2 && Math.abs(dy) <= 1) {
                                    this.responsedGesture = true;
                                    this.checkRoleCanMoveToDirection(index, 1, view);
                                }
                                else if (dx < -2 && Math.abs(dy) <= 1) {
                                    this.responsedGesture = true;
                                    this.checkRoleCanMoveToDirection(index, 2, view);
                                }
                                else if (dy > 2 && Math.abs(dx) <= 1) {
                                    this.responsedGesture = true;
                                    this.checkRoleCanMoveToDirection(index, 3, view);
                                }
                                else if (dy < -2 && Math.abs(dx) <= 1) {
                                    this.responsedGesture = true;
                                    this.checkRoleCanMoveToDirection(index, 4, view);
                                }
                            }
                        },
                        onTouchUp: (event) => {
                            this.responsedGesture = false;
                        },
                    });
                    return view;
                })),
            ], {
                width: kWidth,
                height: kHeight,
                layoutConfig: layoutConfig().just().configAlignment(doric.Gravity.Center),
                backgroundColor: buttonColor,
                border: {
                    color: buttonColor,
                    width: 4,
                },
            }),
            doric.flexlayout([
                (this.saveBtn = doric.text({
                    text: "保存进度",
                    textColor: doric.Color.WHITE,
                    layoutConfig: layoutConfig().just(),
                    width: 90,
                    height: 32,
                    backgroundColor: buttonColor,
                    corners: 16,
                })),
                (this.rePlayBtn = doric.text({
                    text: "重新开始",
                    textColor: doric.Color.WHITE,
                    layoutConfig: layoutConfig().just(),
                    width: 90,
                    height: 32,
                    backgroundColor: buttonColor,
                    corners: 16,
                })),
                (this.backBtn = doric.text({
                    text: "回退",
                    textColor: doric.Color.WHITE,
                    layoutConfig: layoutConfig().just(),
                    width: 90,
                    height: 32,
                    backgroundColor: buttonColor,
                    corners: 16,
                })),
            ], {
                width: kWidth,
                layoutConfig: layoutConfig()
                    .justWidth()
                    .fitHeight()
                    .configAlignment(doric.Gravity.Center)
                    .configMargin({ top: 20 }),
                flexConfig: {
                    flexDirection: doric.FlexDirection.ROW,
                    justifyContent: doric.Justify.SPACE_AROUND,
                },
            }),
        ], {
            layoutConfig: layoutConfig().most(),
            backgroundColor: doric.Color.parse("#FDF5E6"),
            space: 20,
        }).in(rootView);
        this.attached(state, this);
    }
    onCreate() {
        this.dataModel.steps = [];
        this.dataModel.rolePositions = [
            {
                name: "张飞",
                type: 12,
                origin: { x: 0, y: 0 },
                photoPath: "assets/pic11.png",
            },
            {
                name: "曹操",
                type: 22,
                origin: { x: 1, y: 0 },
                photoPath: "assets/pic0.png",
            },
            {
                name: "赵云",
                type: 12,
                origin: { x: 3, y: 0 },
                photoPath: "assets/pic10.png",
            },
            {
                name: "黄忠",
                type: 12,
                origin: { x: 0, y: 2 },
                photoPath: "assets/pic14.png",
            },
            {
                name: "关羽",
                type: 21,
                origin: { x: 1, y: 2 },
                photoPath: "assets/pic3.png",
            },
            {
                name: "马超",
                type: 12,
                origin: { x: 3, y: 2 },
                photoPath: "assets/pic13.png",
            },
            {
                name: "卒1",
                type: 11,
                origin: { x: 1, y: 3 },
                photoPath: "assets/pic6.png",
            },
            {
                name: "卒2",
                type: 11,
                origin: { x: 2, y: 3 },
                photoPath: "assets/pic6.png",
            },
            {
                name: "卒3",
                type: 11,
                origin: { x: 0, y: 4 },
                photoPath: "assets/pic6.png",
            },
            {
                name: "卒4",
                type: 11,
                origin: { x: 3, y: 4 },
                photoPath: "assets/pic6.png",
            },
        ];
        // 读取进度缓存
        doric.storage(this.context)
            .getItem(kGameProgressKey)
            .then((cache) => {
            if (cache) {
                doric.log(`onCreate 读取缓存: ${cache}`);
                const s = JSON.parse(cache);
                this.dataModel = s;
                this.resetSubViewsFrame(s);
            }
        });
    }
};
DoricHuaRongDao = __decorate([
    Entry
], DoricHuaRongDao);
//# sourceMappingURL=DoricHuaRongDao.js.map
