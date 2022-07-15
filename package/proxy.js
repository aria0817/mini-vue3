// Proxy 在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。
// 用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

// 
// Reflect 
/**
 * 1. 只要Proxy对象具有的代理方法，Reflect对象全部具有，以静态方法的形式存在 【它与Proxy对象的方法是一一对应的。】
 * 2. 修改某些Object方法的返回结果，让其变得更合理（定义不存在属性行为的时候不报错而是返回false）
 * 3. 让Object操作都变成函数行为  // 比如 name in obj,delete obj[name]会变成Reflect.has(obj,name)和Reflect.deleteProperty(obj,name)

 */
const proxyObj = (target) => {
    return new Proxy(target, {
        // get() 方法用于拦截某个属性的读取操作 
        get (target, propKey) {
            console.log(`getting ${propKey}!`);
            return Reflect.get(target, propKey);
        },
        // 来拦截某个属性的赋值操作
        set (target, propKey, value) {
            console.log(`setting ${propKey} = ${value}`);
            return Reflect.set(target, propKey, value);
        },
        // 方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。
        deleteProperty(target, propKey){
            console.log(`delete ${propKey}`)
            return Reflect.deleteProperty(target, propKey);
        }
    })
}

let obj1 = {
    a:1,
    b:2
}

let obj2 = proxyObj(obj1);
delete obj2.a
console.log(obj1.a);


