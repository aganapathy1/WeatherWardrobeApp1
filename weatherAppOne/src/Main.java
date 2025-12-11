//lines 4-232 were created using the VSCode Copilot and youtube playlist:
//https://www.youtube.com/playlist?list=PL6gx4Cwl9DGBzfXLWLSYVy8EbTdpGbUIG
//combo box code was created with the help of google and aishwarya's mother
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.shape.Circle;
import javafx.stage.Stage;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

//imports for combobox
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.control.ComboBox;

public class Main extends Application {
    Stage window;
    Wardrobe wardrobe;
    Scene screen1, screen2, screen3, screen4, screen5;

    String selectedColor = "";

    @Override
    public void start(Stage primaryStage) {
        window = primaryStage;
        wardrobe = new Wardrobe();

        // SCREEN 1 (Start Screen)
        BorderPane s1 = new BorderPane();
        s1.setPadding(new Insets(40));
        s1.setStyle("-fx-background-color: #b3bbffff;");

        Label welcome = new Label("Welcome");
        welcome.setStyle("-fx-font-size: 40px; -fx-text-fill: #1a1a1a;");

        Button startBtn = new Button("Start!");
        startBtn.setStyle("-fx-background-color: #004c99; -fx-text-fill: white; -fx-font-size: 25px;");
        startBtn.setOnAction(e -> window.setScene(screen2));

        HBox s1Layout = new HBox(40, welcome, startBtn);
        s1Layout.setAlignment(Pos.CENTER);
        s1.setCenter(s1Layout);
        screen1 = new Scene(s1, 800, 500);

        // SCREEN 2
        VBox s2 = new VBox(40);
        s2.setAlignment(Pos.CENTER);
        s2.setStyle("-fx-background-color: #b3e5ff;");

        Button updateWardrobeBtn = new Button("Update Wardrobe");
        updateWardrobeBtn.setStyle("-fx-background-color: grey; -fx-font-size: 25px;");
        updateWardrobeBtn.setOnAction(e -> window.setScene(screen5));

        Button continueBtn = new Button("Continue");
        continueBtn.setStyle("-fx-background-color: grey; -fx-font-size: 25px;");
        continueBtn.setOnAction(e -> window.setScene(screen3));

        s2.getChildren().addAll(updateWardrobeBtn, continueBtn);
        screen2 = new Scene(s2, 800, 500);

        // SCREEN 3
        BorderPane s3 = new BorderPane();
        s3.setStyle("-fx-background-color: #b3e5ff;");

        Button plusBtn = new Button("+");
        plusBtn.setStyle("-fx-background-color: grey; -fx-font-size: 20px;");
        plusBtn.setOnAction(e -> window.setScene(screen5));
        BorderPane.setAlignment(plusBtn, Pos.TOP_RIGHT);
        BorderPane.setMargin(plusBtn, new Insets(10));
        s3.setTop(plusBtn);

        HBox temps = new HBox(40);
        temps.setAlignment(Pos.TOP_CENTER);
        temps.setPadding(new Insets(60, 0, 0, 0));

        Button fBtn = new Button("Fahrenheit Temperature");
        fBtn.setShape(new Circle(60));
        fBtn.setMinSize(120, 120);
        fBtn.setStyle("-fx-background-color: red; -fx-text-fill: white; -fx-font-size: 30px;");
        fBtn.setOnAction(e -> showOutfitRec("F"));

        Button cBtn = new Button("Celsius Temperature");
        cBtn.setShape(new Circle(60));
        cBtn.setMinSize(120, 120);
        cBtn.setStyle("-fx-background-color: red; -fx-text-fill: white; -fx-font-size: 30px;");
        cBtn.setOnAction(e -> showOutfitRec("C"));

        temps.getChildren().addAll(fBtn, cBtn);
        s3.setCenter(temps);
        screen3 = new Scene(s3, 800, 500);

        // SCREEN 4
        BorderPane s4 = new BorderPane();
        s4.setStyle("-fx-background-color: #b3e5ff;");
        s4.setPadding(new Insets(20));

        HBox topBar4 = new HBox(20);
        Label chosenLabel = new Label("Suggested outfit:");
        chosenLabel.setStyle("-fx-font-size: 32px;");

        Button home4 = new Button("Home");
        home4.setStyle("-fx-background-color: grey;");
        home4.setOnAction(e -> window.setScene(screen1));

        topBar4.getChildren().addAll(chosenLabel, home4);
        s4.setTop(topBar4);

        TextArea outfitBox = new TextArea();
        outfitBox.setPromptText("Your recommended outfit will appear here");
        outfitBox.setPrefWidth(300);
        outfitBox.setPrefHeight(300);
        outfitBox.setEditable(false);
        outfitBox.setWrapText(true);
        s4.setCenter(outfitBox);

        Button next4 = new Button("Back");
        next4.setStyle("-fx-background-color: grey; -fx-font-size: 25px;");
        next4.setOnAction(e -> window.setScene(screen3));
        BorderPane.setAlignment(next4, Pos.CENTER);
        BorderPane.setMargin(next4, new Insets(20));
        s4.setBottom(next4);
        screen4 = new Scene(s4, 800, 500);

        // SCREEN 5 (WARDROBE)
        BorderPane s5 = new BorderPane();
        s5.setStyle("-fx-background-color: #b3e5ff;");
        s5.setPadding(new Insets(20));

        Button home5 = new Button("Home");
        home5.setStyle("-fx-background-color: grey;");
        home5.setOnAction(e -> window.setScene(screen1));
        BorderPane.setAlignment(home5, Pos.TOP_RIGHT);
        s5.setTop(home5);

        VBox items = new VBox(20);
        items.setPadding(new Insets(40));

        String[] clothing = {"Shoes", "Jeans", "Tops"};
        ObservableList<String> options = FXCollections.observableArrayList(
                "Select Color",
                "Blue",
                "Green",
                "Pink",
                "Yellow",
                "Orange",
                "Magenta",
                "Purple",
                "Black",
                "White"
        );
        for (String item : clothing) {
            HBox section = new HBox(15);
            section.setStyle("-fx-border-color: #004c99; -fx-border-width: 1; -fx-padding: 10;");

            Label name = new Label(item);
            name.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");
            name.setPrefWidth(80);

//            TextField colorInput = new TextField();
//            colorInput.setPromptText("Color");
//            colorInput.setPrefWidth(100);

            // Create the ComboBox with the options
            ComboBox<String> comboBox = new ComboBox<>(options);

            // Optional: Set a default value
            comboBox.setValue("Select Color");
//   final String selectedColor ="";
            // Add a listener to handle selection changes
            comboBox.valueProperty().addListener((observable, oldValue, newValue) -> {
                selectedColor = newValue; // Update the variable automatically
                //   System.out.println("Variable updated: " + myVariable);
            });

            Button add = new Button("+");
            add.setStyle("-fx-background-color: #004c99; -fx-text-fill: white; -fx-font-size: 14px;");
            add.setOnAction(e -> {
                //  String color = colorInput.getText().trim();
                String color = selectedColor;
                if (!color.isEmpty()) {
                    switch (item) {
                        case "Shoes": wardrobe.addShoes(color); break;
                        case "Jeans": wardrobe.addJeans(color); break;
                        case "Tops": wardrobe.addTops(color); break;
                    }
                    // colorInput.clear();
                    updateWardrobeDisplay(s5);
                }
            });

            section.getChildren().addAll(name, comboBox, add);
            items.getChildren().add(section);
        }

        ScrollPane scroll = new ScrollPane(items);
        scroll.setFitToWidth(true);
        s5.setCenter(scroll);

        TextArea wardrobeDisplay = new TextArea();
        wardrobeDisplay.setPromptText("Your wardrobe items will appear here");
        wardrobeDisplay.setPrefHeight(150);
        wardrobeDisplay.setEditable(false);
        wardrobeDisplay.setWrapText(true);
        wardrobeDisplay.setText(wardrobe.getAllItems());
        s5.setBottom(wardrobeDisplay);
        screen5 = new Scene(s5, 800, 600);

        window.setScene(screen1);
        window.setTitle("Weather Wardrobe App");
        window.show();
    }

    private void updateWardrobeDisplay(BorderPane s5) {
        TextArea wardrobeDisplay = (TextArea) s5.getBottom();
        wardrobeDisplay.setText(wardrobe.getAllItems());
    }

    private void showOutfitRec(String unit) {
        WeatherData weather = readCSVWeather("weather_data.csv", "Phoenix-AZ");
        String recommendation = outfitOutput(weather, unit);
        BorderPane s4 = (BorderPane) screen4.getRoot();
        TextArea outfitBox = (TextArea) s4.getCenter();
        outfitBox.setText(recommendation);
        window.setScene(screen4);
    }

    //based on the temperature, suggest an outfit
    private String outfitOutput(WeatherData weather, String tempUnit) {
        String output = "";
        output += "OUTFIT RECOMMENDATION\n";

        //no weather:
        if (weather == null) {
            output += "Weather data not available.\n";
            output += "Your Current Wardrobe! Choose from what is available based on the suggested outfit:\n";
            output += wardrobe.getAllItems();
            return output;
        }

        //calculate temperature in celcius and fahrenheit
        int tempF = (int) weather.temp;
        int tempC = (int) weather.temp;
        if (tempUnit.equals("F")) {
            tempF = (int) (weather.temp * 9.0 / 5.0 + 32);
        }

        //display weather stats on screen
        output += "Date: " + (weather.date) + "\n";
        output += "Temperature: " + (tempF) + "°" + tempUnit + "\n";
        output += "Conditions: " + (weather.conditions) + "\n";
        output += "Wind Speed: " + (weather.windspeed) + " mph\n\n";

        output += "Today's Weather: ";

        //based on whether the user chooses celsius or fahrenheit
        if (tempUnit.equals("C")) {
            if (tempC < 0) {
                output += "It's COLD!\nConsider Wearing: Heavy jacket, jeans, boots, warm layers.\n";
            } else if (tempC < 15) {
                output += "It's COOL.\nConsider Wearing: Light jacket, jeans, casual shoes.\n";
            } else if (tempC < 23) {
                output += "It's MILD.\nConsider Wearing: Light sweater, jeans, sneakers.\n";
            } else {
                output += "It's HOT.\nConsider Wearing: Tank top or light shirt, leggings or shorts, casual shoes.\n";
            }
        } else {
            if (tempF < 32) {
                output += "It's COLD!\nConsider Wearing: Heavy jacket, jeans, boots, warm layers.\n";
            } else if (tempF < 59) {
                output += "It's COOL.\nConsider Wearing: Light jacket, jeans, casual shoes.\n";
            } else if (tempF < 73) {
                output += "It's MILD.\nConsider Wearing: Light sweater, jeans, sneakers.\n";
            } else {
                output += "It's HOT.\nConsider Wearing: Tank top or light shirt, leggings or shorts, casual shoes.\n";
            }
        }
        output += "\nYour Current Wardrobe! Choose from what is available based on the suggested outfit:\n";
        output += wardrobe.getAllItems(); //tostring from wardrobe class with all outfits in formatted style
        return output;
    }

    //uses the weather_data csv and file path to split into different parts based on date, location, temp etc and get each part of the CSV data
    private WeatherData readCSVWeather(String fileName, String cityName) {
        String file = "C:\\Users\\aishw\\OneDrive\\Javaproject\\weatherAppOne\\src\\main\\" + fileName;
        //AI created try with resources block (line 293-316)
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            reader.readLine(); //bufferredreader  skip header
            String line;
            String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            while ((line = reader.readLine()) != null) {
                String[] cols = line.split(",");
                if (cols.length >= 6) {
                    String date = cols[0].trim();
                    String city = cols[1].trim().replace("\"", "");
                    double temp = Double.parseDouble(cols[2].trim());
                    String conditions = cols[3].trim().replace("\"", "");
                    double windspeed = Double.parseDouble(cols[5].trim());

                    if (date.equals(today) && city.equalsIgnoreCase(cityName)) {
                        return new WeatherData(date, temp, conditions, windspeed);
                    }
                }
            }
        } catch (IOException e) {
            System.out.println("CSV read error: " + e.getMessage());
        }
        return null;
    }

    //launches javaFX
    public static void main(String[] args) {
        launch(args);
    }
}
