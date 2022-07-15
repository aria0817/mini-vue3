function reactive(target) {
    return new Proxy(target, {
        get(target, key) {
            //判断是否为对象
            console.log('get', key);
            // 优雅高效的处理异常
            const res = Reflect.get(target, key);
            track(target, key)
            // 只有当返回值为对象的时候才会对这个对象进行响应式
            return isObject(res) ? reactive(target[key]) : res
        },
        set(target, key, val) {
            console.log('set', key);
            // return bool 
            const res = Reflect.set(target, key, val);
            tirgger(target, key)
            return res;
        },
        deleteProperty(target, key) {
            console.log('delete', key);
            tirgger(target, key)
            const res = Reflect.deleteProperty(target, key)
            return res
        }
    })
}

// // 临时存储副作用函数
const effectStack = [];

// 当前副作用
let activeEffect;

// 建立副作用
// Vue 通过一个副作用 (effect) 来跟踪函数。副作用是一个函数的包裹器，在函数被调用之前就启动跟踪。Vue 知道哪个副作用在何时运行，并能在需要时再次执行它。
function effect(fn) {
    // 执行一次，触发依赖收集 
    activeEffect = fn;
    const e = createReactiveEffect(fn)
    e()
    return e;
}

function createReactiveEffect(fn) {
    const effect = function () {
        try {
            effectStack.push(fn);
            return fn();
        } finally {
            effectStack.pop()
        }
    }
    return effect
}



// 保存依赖关系的数据结构
const targetMap = new WeakMap();

// 在计算机程序设计中，弱引用与强引用相对，是指不能确保其引用的对象不会被垃圾回收器回收的引用。一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此 可能在任何时刻被回收。

// why weakMap:  WeakMap的键所指向的对象，不计入垃圾回收机制。
// Map 相对于 WeakMap
// Map 的键可以是任意类型，WeakMap 只接受对象作为键（null除外），不接受其他类型的值作为键。
// Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键； WeakMap 的键是弱引用，键所指向的对象可以被垃圾回收，此时键是无效的
// Map 可以被遍历， WeakMap不能被遍历。

// let targetMap = new weakMap{}
// 多个响应式对象  WeakMap {}
// 每个对象对应多个 key Map {}
// 每个key 对应多个更新函数 fns  set[]




// 依赖收集：建立target key和fn之间的关系
//首先根据 proxy对象，获取存放deps的depsMap，然后通过访问的属性名key获取对应的dep,然后将当前激活的effect存入当前dep收集依赖
function track(target, key) {
    //获取effect
    const effect = activeEffect;
    if (effect) {
        // 获取target对应的depMap
        let depMap = targetMap.get(target);
        if (!depMap) {
            depMap = new Map();
            targetMap.set(target, depMap);
        }
        // 3. 获取key对应的依赖数组 
        let deps = depMap.get(key)
        if (!deps) {
            deps = new Set(); // 去重
            depMap.set(key, deps)
        }
        //4. 建依赖关系，把副作用函数加到对应的key的set中
        deps.add(effect)
        console.log(depMap,'*****track****');
    }
}

// 触发副作用执行： 根据taget，key  => 获取到fns
function tirgger(target, key) {
    const depMap = targetMap.get(target);
    console.log(depMap,'*** tirgger *****');
    if (depMap) {
        const deps = depMap.get(key)
        if (deps) {
            deps.forEach(dep => {
                dep()
            });
        }
    }
}

const isObject = v => typeof v === 'object'

let state = reactive({
    a: 1,
    b: 2,
    c: {
        aa: 111
    }
})
effect(()=>{
    console.log('****更新*******');
});

state.a
state.a = 123123
// state.a = 111111
// state.c
// state.c.aa
// console.log(state);