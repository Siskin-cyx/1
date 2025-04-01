<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>栈操作动画演示</title>
    <style>
        /* 保持原有样式，新增动画相关样式 */
        .sequence {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #fff;
        }

        .step {
            margin: 10px 0;
            padding: 10px;
            border-left: 3px solid #4CAF50;
            background: #f8f8f8;
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.3s ease;
            max-height: 0;
            overflow: hidden;
        }

        .step.active {
            opacity: 1;
            transform: translateX(0);
            max-height: 100px;
        }

        .controls {
            display: flex;
            gap: 10px;
            margin: 10px 0;
        }

        .control-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .play-btn {
            background: #4CAF50;
            color: white;
        }

        .reset-btn {
            background: #2196F3;
            color: white;
        }

        .step-counter {
            color: #666;
            font-style: italic;
        }

        @keyframes stackEffect {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .stack-animate {
            animation: stackEffect 0.3s ease;
        }

        .current-step {
            background: #e3f2fd;
            border-left-color: #2196F3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>栈操作动画演示</h1>
        <div class="input-group">
            <input type="number" id="inputN" min="1" placeholder="输入车厢数量">
            <button onclick="generateSequences()" class="control-btn play-btn">生成序列</button>
        </div>
        <div id="output" class="output"></div>
    </div>

    <script>
        class SequenceAnimator {
            constructor(sequenceDiv, result) {
                this.steps = result.ops;
                this.output = result.output;
                this.currentStep = 0;
                this.isPlaying = false;
                this.intervalId = null;
                this.speed = 1000;
                
                // 初始化DOM结构
                sequenceDiv.innerHTML = `
                    <h3>输出序列: [${result.output.join(', ')}]</h3>
                    <div class="controls">
                        <button class="control-btn play-btn" onclick="this.parentElement.parentElement.animator.togglePlay()">▶ 播放</button>
                        <button class="control-btn reset-btn" onclick="this.parentElement.parentElement.animator.reset()">↺ 重置</button>
                        <span class="step-counter">步骤: 0/${this.steps.length}</span>
                    </div>
                    <div class="steps-container"></div>
                `;

                this.dom = {
                    stepsContainer: sequenceDiv.querySelector('.steps-container'),
                    counter: sequenceDiv.querySelector('.step-counter'),
                    playBtn: sequenceDiv.querySelector('.play-btn')
                };

                // 创建步骤元素
                this.stepElements = [];
                const simStack = new SqStack();
                let inputNum = 1;
                let outputIdx = 0;

                this.steps.forEach((op, i) => {
                    const stepDiv = document.createElement('div');
                    stepDiv.className = 'step';
                    
                    if (op === 'I') {
                        simStack.push(inputNum);
                        stepDiv.innerHTML = `进栈 ${inputNum} 
                            <div class="stack">当前栈: ${simStack.toString()}</div>`;
                        inputNum++;
                    } else {
                        const e = simStack.pop();
                        stepDiv.innerHTML = `出栈 ${e} → 输出: 
                            [${result.output.slice(0, ++outputIdx).join(', ')}]
                            <div class="stack">当前栈: ${simStack.toString()}</div>`;
                    }
                    
                    this.stepElements.push(stepDiv);
                    this.dom.stepsContainer.appendChild(stepDiv);
                });

                sequenceDiv.animator = this; // 将动画控制器绑定到DOM元素
            }

            togglePlay() {
                this.isPlaying = !this.isPlaying;
                this.dom.playBtn.textContent = this.isPlaying ? '⏸ 暂停' : '▶ 播放';
                
                if (this.isPlaying) {
                    this.playNextStep();
                } else {
                    clearInterval(this.intervalId);
                }
            }

            playNextStep() {
                if (this.currentStep >= this.steps.length) {
                    this.togglePlay();
                    return;
                }

                this.showStep(this.currentStep);
                this.currentStep++;
                
                this.intervalId = setTimeout(() => {
                    if (this.isPlaying) this.playNextStep();
                }, this.speed);
            }

            showStep(stepIndex) {
                if (stepIndex >= this.stepElements.length) return;

                // 添加动画效果
                const stepElement = this.stepElements[stepIndex];
                stepElement.classList.add('active');
                stepElement.querySelector('.stack').classList.add('stack-animate');
                
                // 更新计数器
                this.dom.counter.textContent = `步骤: ${stepIndex + 1}/${this.steps.length}`;

                // 滚动到可见区域
                stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // 移除动画类（在动画结束后）
                setTimeout(() => {
                    stepElement.querySelector('.stack').classList.remove('stack-animate');
                }, 300);
            }

            reset() {
                clearInterval(this.intervalId);
                this.currentStep = 0;
                this.isPlaying = false;
                this.dom.playBtn.textContent = '▶ 播放';
                this.dom.counter.textContent = `步骤: 0/${this.steps.length}`;
                this.stepElements.forEach(step => {
                    step.classList.remove('active');
                    step.style.maxHeight = '0';
                });
            }
        }

        // 生成序列的函数（修改后的版本）
        function generateSequences() {
            const n = parseInt(document.getElementById('inputN').value);
            if (isNaN(n) || n < 1) {
                alert("请输入有效的正整数！");
                return;
            }

            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '<div class="loading">生成中...</div>';

            // 异步执行以避免界面冻结
            setTimeout(() => {
                const results = [];
                const stack = new SqStack();
                
                // 实际的回溯算法
                function backtrack(current, output, ops) {
                    if (output.length === n) {
                        results.push({
                            output: [...output],
                            ops: [...ops]
                        });
                        return;
                    }

                    // 出栈分支
                    if (!stack.isEmpty()) {
                        const e = stack.pop();
                        output.push(e);
                        ops.push('O');
                        backtrack(current, output, ops);
                        ops.pop();
                        output.pop();
                        stack.push(e);
                    }

                    // 入栈分支
                    if (current <= n) {
                        stack.push(current);
                        ops.push('I');
                        backtrack(current + 1, output, ops);
                        ops.pop();
                        stack.pop();
                    }
                }

                backtrack(1, [], []);
                outputDiv.innerHTML = '';

                results.forEach((result, index) => {
                    const sequenceDiv = document.createElement('div');
                    sequenceDiv.className = 'sequence';
                    outputDiv.appendChild(sequenceDiv);
                    
                    new SequenceAnimator(sequenceDiv, result);
                });
            }, 100);
        }

        // SqStack 类保持原样
        class SqStack {
            constructor() {
                this.data = [];
            }
            push(e) { this.data.push(e); }
            pop() { return this.data.pop(); }
            isEmpty() { return this.data.length === 0; }
            toString() { return `[${this.data.join(', ')}]`; }
        }
    </script>
</body>
</html>
