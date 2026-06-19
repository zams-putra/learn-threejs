
import * as THREE from 'three'

const container = document.querySelector('.container')
const rect = container.getBoundingClientRect()

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000)
const renderer  = new THREE.WebGLRenderer()

renderer.setSize(container.clientWidth, container.clientHeight)
container.appendChild(renderer.domElement)


// design geo 1
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
const material = new THREE.MeshStandardMaterial({
    color: 0xf0fc65,
    emissive: 0xf0fc65, 
    emissiveIntensity: 0.1,
    wireframe: true
})
const torusKnotGeometry = new THREE.Mesh(geometry, material)
scene.add(torusKnotGeometry)


// design geo 2
const geometry2 = new THREE.SphereGeometry(8, 10, 10)
const material2 = new THREE.MeshStandardMaterial({
    color: 0xfffc65,
    emissive: 0xfffc65,
    emissiveIntensity: 0.1,
    wireframe: true
})
const bola = new THREE.Mesh(geometry2, material2)
scene.add(bola)


// jarak horizon kiri kanan
torusKnotGeometry.position.set(-10, 0, -20)
bola.position.x = 10 


// light 1
const light = new THREE.PointLight(0xf0fc65, 50)
light.position.copy(torusKnotGeometry.position)
scene.add(light)

// light 2
const light2 = new THREE.PointLight(0xfffc65, 50)
light2.position.copy(bola.position)
scene.add(light2)


// object keliatan pas lampu mati 
scene.add(new THREE.AmbientLight(0xffffff, 0.2))


// kondisi -> key nya mesh masing2, value nya ya object
const lampMap = new Map([
    [
        torusKnotGeometry, 
    {
        light: light,
        isOn: false,
    }],
    [
        bola, 
    {
        light: light,
        isOn: false,
    }],
])

// raycaster
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

container.addEventListener('click', (e) => {
    const rect = container.getBoundingClientRect()

    // itung2 an mouse gini gapaham gw, masih pakai AI kalau ginian
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects([torusKnotGeometry, bola])
    if(intersects.length > 0) {
        const clickedMesh = intersects[0].object
        const lamp = lampMap.get(clickedMesh)
        lamp.isOn = !lamp.isOn
        if(lamp.isOn) {
            lamp.light.intensity = 100
            clickedMesh.material.emissiveIntensity = 1
        } else {
            lamp.light.intensity = 0
            clickedMesh.material.emissiveIntensity = 0.1
        }
    }    
})

camera.position.set(0, 0, 30)
function animate(){
    torusKnotGeometry.rotation.x += 0.01
    torusKnotGeometry.rotation.y += 0.01
    bola.rotation.x += 0.01
    bola.rotation.y += 0.01
    renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)