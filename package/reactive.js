function reactive(target) {
    return new Proxy(target, {
        get(target, key) {
            //判断是否为对象
            console.log('get', key);
            // 优雅高效的处理异常
            const res = Reflect.get(target, key);
            track(target, key)
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

let activeEffect;

// 建立副作用
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



// 保存依赖关系的数据结构MAP 
const targetMap = new WeakMap();

// 依赖收集：建立target key和fn之间的关系
function track(target, key) {
    //获取effect
    const effect = effectStack[effectStack.length - 1];
    if (effect) {
        // 获取target对应的map 
        let depMap = targetMap.get(target);
        if (!depMap) {
            depMap = new Map();
            targetMap.set(target, depMap);
        }
        // 3. 获取key对应的set  desp就是fns
        let deps = depMap.get(key)
        if (!deps) {
            deps = new Set(); // 去重
            depMap.set(key, deps)
        }
        //4. 建依赖关系，把副作用函数加到对应的key的set中
        deps.add(effect)
    }
}
// 触发副作用执行： 根据taget，key  => 获取到fns
function tirgger(target, key) {
    const depMap = targetMap.get(target);
    if (depMap) {
        // 
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
state.a
delete state.a

state.c
console.log(state);