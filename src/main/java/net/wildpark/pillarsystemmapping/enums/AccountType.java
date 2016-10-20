package net.wildpark.pillarsystemmapping.enums;

public enum AccountType {
    ADMIN("Администратор"),MANAGER("Управляющий"),WORKER("Сотрудник"),GUEST("Гость");
    private String title;
    
    AccountType(String title){
        this.title=title;
    }

    public String getTitle() {
        return title;
    }
    
    
}
