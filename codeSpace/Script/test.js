const object = {
    a:'some string', 
    b: 42,
}

for(const [key, value] of Object.entries(object)){
    console.log(`${key}:${value}`);
}