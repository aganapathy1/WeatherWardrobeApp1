public class OutfitCombos {
    //intitialize 3 variables that the user selects from update wardrobe page
    private int quantity;
    private String color;
    private String type;

    //constructors that child classes will inherit to get each type of clothes and display with the tostring
    public OutfitCombos() {
        this.quantity = 0;
        this.color = "";
        this.type = "";
    }

    public OutfitCombos(int quantity, String color, String type) {
        this.quantity = quantity;
        this.color = color;
        this.type = type;
    }

    //getter/accessor methods
    public int getQuantity() {
        return quantity;
    }

    public String getColor() {
        return color;
    }

    public String getType() {
        return type;
    }

    //setter/mutator methods
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setType(String type) {
        this.type = type;
    }

    //override/polymorphism
    public String toString() {
        String output = "";
        output = type + " (" + color + ") x" + quantity;
        return output;
    }
}

