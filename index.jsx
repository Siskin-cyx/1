<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>家族管理系统</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f9fc; /* 更清新的背景色 */
        }

        .menu {
            margin-bottom: 20px;
        }

        .menu a {
            display: block;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #66cdaa; /* 更清新的菜单按钮颜色 */
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }

        .menu a:hover {
            background-color: #52be80; /* 鼠标悬停时的颜色 */
        }

        .form-container {
            margin-bottom: 20px;
        }

        input,
        button {
            margin-bottom: 10px;
            padding: 8px;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #b3d9ff; /* 输入框边框颜色 */
        }

        button {
            background-color: #66cdaa; /* 按钮颜色 */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        button:hover {
            background-color: #52be80; /* 鼠标悬停时的按钮颜色 */
        }

        .result {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #b3d9ff; /* 结果区域边框颜色 */
            border-radius: 5px;
            background-color: white; /* 结果区域背景色 */
        }

        .back-button {
            background-color: #ff6961; /* 返回按钮颜色 */
            margin-top: 20px;
        }

        .back-button:hover {
            background-color: #ff4d4d; /* 鼠标悬停时返回按钮颜色 */
        }

        .node circle {
            fill: #fff;
            stroke: #4682b4; /* 节点边框颜色 */
            stroke-width: 3px;
        }

        .node text {
            font: 12px sans-serif;
        }

        .link {
            fill: none;
            stroke: #a9a9a9; /* 连线颜色 */
            stroke-width: 2px;
        }
    </style>
</head>

<body>
    <!-- 以下代码保持不变 -->
    <div id="main-menu" class="menu">
        <h2>家族管理系统菜单</h2>
        <a href="#" onclick="showAddMemberForm()">1. 添加成员</a>
        <a href="#" onclick="showQueryGenerationForm()">2. 查询成员辈分</a>
        <a href="#" onclick="showFamilyTree()">3. 显示家族结构</a>
        <a href="#" onclick="showModifyForm()">4. 修改成员信息</a>
    </div>

    <div id="add-member-form" class="form-container" style="display: none;">
        <h2>添加成员</h2>
        <input type="text" id="add-name" placeholder="成员姓名">
        <input type="text" id="add-info" placeholder="成员信息">
        <input type="text" id="add-parent-name" placeholder="父成员姓名 (若无请输入 -1)">
        <button onclick="addMember()">确认添加</button>
        <button class="back-button" onclick="hideAddMemberForm()">返回菜单</button>
    </div>

    <div id="query-generation-form" class="form-container" style="display: none;">
        <h2>查询成员辈分</h2>
        <input type="text" id="query-name" placeholder="成员姓名">
        <button onclick="queryGeneration()">查询</button>
        <button class="back-button" onclick="hideQueryGenerationForm()">返回菜单</button>
    </div>

    <div id="modify-form" class="form-container" style="display: none;">
        <h2>修改成员信息</h2>
        <input type="text" id="modify-name" placeholder="成员姓名">
        <input type="text" id="modify-info" placeholder="新的成员信息">
        <button onclick="modifyMember()">确认修改</button>
        <button class="back-button" onclick="hideModifyForm()">返回菜单</button>
    </div>

    <div id="family-tree-result" class="result" style="display: none;">
        <h2>家族结构</h2>
        <svg id="family-tree-svg" width="1200" height="800"></svg>
        <button class="back-button" onclick="hideFamilyTree()">返回菜单</button>
    </div>

    <script>
        // 定义家族树结构
        const MAX_TREE_SIZE = 100;
        let familyTree = {
            nodes: [],
            root: -1,
            size: 0
        };

        // 显示添加成员表单
        function showAddMemberForm() {
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('add-member-form').style.display = 'block';
        }

        // 隐藏添加成员表单
        function hideAddMemberForm() {
            document.getElementById('main-menu').style.display = 'block';
            document.getElementById('add-member-form').style.display = 'none';
            document.getElementById('add-name').value = '';
            document.getElementById('add-info').value = '';
            document.getElementById('add-parent-name').value = '';
        }

        // 添加成员
        function addMember() {
            const name = document.getElementById('add-name').value;
            const info = document.getElementById('add-info').value;
            const parentName = document.getElementById('add-parent-name').value;

            if (familyTree.size >= MAX_TREE_SIZE) {
                alert('家族树已满，添加失败。');
                return;
            }

            let parentPos = -1;
            if (parentName !== '-1') {
                parentPos = findMember(parentName);
                if (parentPos === -1) {
                    alert('未找到该成员，添加失败。');
                    return;
                }
            }

            familyTree.nodes.push({
                data: { name, info },
                parent: parentPos
            });
            if (parentPos === -1) {
                familyTree.root = familyTree.size;
            }
            familyTree.size++;
            alert('成员添加成功！');
            hideAddMemberForm();
        }

        // 查找成员
        function findMember(name) {
            for (let i = 0; i < familyTree.size; i++) {
                if (familyTree.nodes[i].data.name === name) {
                    return i;
                }
            }
            return -1;
        }

        // 显示查询辈分表单
        function showQueryGenerationForm() {
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('query-generation-form').style.display = 'block';
        }

        // 隐藏查询辈分表单
        function hideQueryGenerationForm() {
            document.getElementById('main-menu').style.display = 'block';
            document.getElementById('query-generation-form').style.display = 'none';
            document.getElementById('query-name').value = '';
        }

        // 查询成员辈分
        function queryGeneration() {
            const name = document.getElementById('query-name').value;
            const pos = findMember(name);
            if (pos !== -1) {
                const generation = getGeneration(pos);
                alert(`${name} 所在的第 ${generation} 辈`);
            } else {
                alert(`未找到成员: ${name}`);
            }
            hideQueryGenerationForm();
        }

        // 获取成员辈分
        function getGeneration(pos) {
            let generation = 1;
            while (familyTree.nodes[pos].parent !== -1) {
                generation++;
                pos = familyTree.nodes[pos].parent;
            }
            return generation;
        }

        // 显示家族结构
        function showFamilyTree() {
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('family-tree-result').style.display = 'block';
            drawFamilyTree();
        }

        // 隐藏家族结构
        function hideFamilyTree() {
            document.getElementById('main-menu').style.display = 'block';
            document.getElementById('family-tree-result').style.display = 'none';
            const svg = d3.select("#family-tree-svg");
            svg.selectAll("*").remove();
        }

        // 绘制家族树
        function drawFamilyTree() {
            if (familyTree.root === -1) return;

            // 转换数据为 D3 可处理的格式
            const rootData = {
                name: familyTree.nodes[familyTree.root].data.name,
                children: []
            };

            function buildTree(node, parentIndex) {
                for (let i = 0; i < familyTree.size; i++) {
                    if (familyTree.nodes[i].parent === parentIndex) {
                        const child = {
                            name: familyTree.nodes[i].data.name,
                            children: []
                        };
                        node.children.push(child);
                        buildTree(child, i);
                    }
                }
            }

            buildTree(rootData, familyTree.root);

            const root = d3.hierarchy(rootData);
            const treeLayout = d3.tree().size([700, 600]);
            const treeData = treeLayout(root);

            const svg = d3.select("#family-tree-svg");
            svg.selectAll("*").remove();

            // 绘制连线
            const link = svg.append("g")
              .selectAll(".link")
              .data(treeData.links())
              .enter().append("path")
              .attr("class", "link")
              .attr("d", d3.linkVertical()
                 .x(d => d.y)
                 .y(d => d.x));

            // 绘制节点
            const node = svg.append("g")
              .selectAll(".node")
              .data(treeData.descendants())
              .enter().append("g")
              .attr("class", "node")
              .attr("transform", d => `translate(${d.y},${d.x})`);

            node.append("circle")
              .attr("r", 5);

            node.append("text")
              .attr("dy", ".35em")
              .attr("x", d => d.children ? -13 : 13)
              .style("text-anchor", d => d.children ? "end" : "start")
              .text(d => d.data.name);
        }

        // 显示修改表单
        function showModifyForm() {
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('modify-form').style.display = 'block';
        }

        // 隐藏修改表单
        function hideModifyForm() {
            document.getElementById('main-menu').style.display = 'block';
            document.getElementById('modify-form').style.display = 'none';
            document.getElementById('modify-name').value = '';
            document.getElementById('modify-info').value = '';
        }

        // 修改成员信息
        function modifyMember() {
            const name = document.getElementById('modify-name').value;
            const newInfo = document.getElementById('modify-info').value;
            const pos = findMember(name);
            if (pos !== -1) {
                familyTree.nodes[pos].data.info = newInfo;
                alert('成员信息修改成功！');
            } else {
                alert(`未找到成员: ${name}`);
            }
            hideModifyForm();
        }
    </script>
</body>

</html>
