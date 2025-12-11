public class Jeans extends OutfitCombos {
    //constructors
    public Jeans() {
        super(0, "", "Jeans");
    }

    public Jeans(int quantity, String color) {
        super(quantity, color, "Jeans");
    }

    //overriding/polymorphism
    public String toString() {
        return "Jeans (" + getColor() + ") x" + getQuantity();
    }
}