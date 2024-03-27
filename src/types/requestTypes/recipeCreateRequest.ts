export type RecipeCreateRequest = {
    title: string;
    description: string;
    portions: number;
    portionsUnit: string;
    ingredients: {name: string, quantity: number, unit: string}[];
    instructions: string[];
    mainCategory: string;
    subCategory: string;
    tags: string[] | undefined;
    image: {
      fileName: string;
      fileType: string;
      size: number;
      base64: string;
      caption: string;
    } | undefined;
    public: boolean;
  };