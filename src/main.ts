const Vue = {
    createApp(options: any) {
        console.log(options);
        // app实例 
        return {
            mount(selector) {
                const parent = document.querySelector(selector);
                // 根组件配置，转换成DOM结构
                // 遍历子元素，然后生成虚拟DOM，
                // 旧的实现过程： template => render => vdom => dom 

                // 首先判断options有没有render函数 
                if (!options.render) {
                    options.render = this.compile(parent.innerHtml)
                }

                // 执行render函数，获取视图结构
                console.log(options);
                // 清空现有的结构 
                const el = options.render.call(options.data())
                parent.innerHTML = ''
                parent.appendChild(el)


            },
            // 渲染函数 传入template return render函数  这里简单来写就直接reutrn一个真实dom 
            compile(template) {
                // 解析template =>  ast  => ast(经过translform的ast) => generate => render
                return function render() {
                    const h3 = document.createElement('h3');
                    h3.textContent = this.title;
                    return h3;
                }
            }
        }
    }
}

const { createApp } = Vue

import App from './App.vue'

createApp(App).mount('#app')
