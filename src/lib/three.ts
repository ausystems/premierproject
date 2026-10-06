/**
 * The few three.js classes the site uses, re-exported from one module so the bundler can leave the
 * rest of the library out of the lazy WebGL chunk. Import this, never "three" directly, at runtime.
 */
export {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  BufferGeometry,
  BufferAttribute,
  Mesh,
  ShaderMaterial,
  PlaneGeometry,
  TextureLoader,
  Texture,
  Vector2,
  Vector3,
  Color,
  SRGBColorSpace,
  DoubleSide,
} from "three";
