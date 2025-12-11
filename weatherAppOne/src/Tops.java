public class Tops extends OutfitCombos {
    public Tops() {
        super(0, "", "Tops");
    }

    public Tops(int quantity, String color) {
        super(quantity, color, "Tops");
    }

    //override/polymorphism
    public String toString() {
        return "Tops (" + getColor() + ") x" + getQuantity();
    }
}
