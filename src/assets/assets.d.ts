// Arquivo que vai ter somente TypeScript e para que ele entenda que todo arquivo com extensão png pode ser importado.

declare;
module "*.png";

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
