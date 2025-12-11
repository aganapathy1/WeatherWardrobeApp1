public class WeatherData {
    //initialize variables
    String date;
    double temp;
    String conditions;
    double windspeed;

    //basic constructor: will use the weather_data csv file and split the csv into the data, temp conditions and windspeed parts
    //then it will store using this. for later calculations
    WeatherData(String date, double temp, String conditions, double windspeed) {
        this.date = date;
        this.temp = temp;
        this.conditions = conditions;
        this.windspeed = windspeed;
    }
}
