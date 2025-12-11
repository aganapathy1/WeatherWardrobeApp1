//this is the wardrobe that is shown overall after the user adds items
import java.util.ArrayList;

public class Wardrobe {
    private ArrayList<Shoes> shoes;
    private ArrayList<Jeans> jeans;
    private ArrayList<Tops> tops;

    //initializing lists to no clothes item entered
    public Wardrobe() {
        shoes = new ArrayList<>();
        jeans = new ArrayList<>();
        tops = new ArrayList<>();
    }

    //add shoes to wardrobe
    public void addShoes(String color) {
        boolean flag = false;
        for (Shoes s : shoes) {
            if (s.getColor().equalsIgnoreCase(color)) {
                s.setQuantity(s.getQuantity() + 1); //calls setter method from outfitcombos
                flag = true;
            }
        }
        //not found existing previous color- new shoe type, so add quantity
        if (!flag) {
            shoes.add(new Shoes(1, color));
        }
    }

    //add jeans to wardrobe
    public void addJeans(String color) {
        boolean flag = false;
        for (Jeans j : jeans) {
            if (j.getColor().equalsIgnoreCase(color)) {
                j.setQuantity(j.getQuantity() + 1);
                flag = true;
            }
        }
        //not found existing previous color- new jean type, so add quantity
        if (!flag) {
            jeans.add(new Jeans(1, color));
        }
    }

    //add tops to the wardrobe
    public void addTops(String color) {
        boolean flag = false;
        for (Tops t : tops) {
            if (t.getColor().equalsIgnoreCase(color)) {
                t.setQuantity(t.getQuantity() + 1);
                flag = true;
            }
        }
        //not found existing previous color- new top type, so add quantity
        if (!flag) {
            tops.add(new Tops(1, color));
        }
    }

    //display current wardrobe as a string
    public String getAllItems() {
        String output = "";

        if (!(shoes.equals(""))) {
            output += "SHOES:\n";
            for (Shoes s : shoes) {
                output += " - " + s.toString() + "\n";
            }
        }

        if (!(jeans.equals(""))) {
            output += "JEANS:\n";
            for (Jeans j : jeans) {
                output += " - " + j.toString() + "\n";
            }
        }

        if (!(tops.equals(""))) {
            output += "TOPS:\n";
            for (Tops t : tops) {
                output += " - " + t.toString() + "\n";
            }
        }

        //no clothes entered
        if(output.equals("")) {
            output = "There are no clothes in the wardrobe.";
        }
        return output;
    }
}