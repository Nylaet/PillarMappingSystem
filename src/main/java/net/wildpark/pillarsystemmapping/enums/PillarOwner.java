package net.wildpark.pillarsystemmapping.enums;

public enum PillarOwner {
    OBLENERGO("ОблЭнерго"),NIKTRANS("НиколаевЭлектроТранс"),GORSVET("НиколаевГорСвет"),PRIVATEOWNER("Частный владелец");
    private String about;

    private PillarOwner(String about) {
        this.about = about;
    }

    public String getAbout() {
        return about;
    }   
    
}
