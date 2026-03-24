export interface IProduct {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
}
