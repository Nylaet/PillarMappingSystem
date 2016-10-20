/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package net.wildpark.pillarsystemmapping.controllers;

import javax.inject.Named;
import javax.enterprise.context.SessionScoped;
import java.io.Serializable;
import java.util.Date;
import javax.ejb.EJB;
import javax.faces.application.FacesMessage;
import javax.faces.application.FacesMessage.Severity;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import net.wildpark.pillarsystemmapping.entitys.User;
import net.wildpark.pillarsystemmapping.enums.AccountType;
import net.wildpark.pillarsystemmapping.facades.UserFacade;

/**
 *
 * @author Panker-RDP
 */
@Named(value = "userController")
@SessionScoped
public class UserController implements Serializable {

    @EJB
    private UserFacade uf;
    private User current;
    private User created;
    private boolean entered = false;
    private boolean admin = false;
    private String newPass;

    public UserController() {
        if (uf.findAll().isEmpty()) {
            created = new User();
            created.setLogin("panker");
            created.setAccountType(AccountType.ADMIN);
            created.setPasswordHash("156456851");
            uf.create(created);
            created = new User();
            created.setLogin("drizer");
            created.setAccountType(AccountType.ADMIN);
            created.setPasswordHash("12345678");
            uf.create(created);
        }
    }

    public void login() {
        HttpServletRequest request = (HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext().getRequest();
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null) {
            ipAddress = request.getRemoteAddr();
        }

        for (User user : uf.findAll()) {
            if (user.getLogin().equals(current.getLogin())) {
                if (user.getPasswordHash().equals(current.getPasswordHash())) {
                    current = user;
                    current.setLastVisit(new Date());
                    current.setLastSession(ipAddress);
                    uf.edit(current);
                    entered = true;
                    if (current.getAccountType().equals(AccountType.ADMIN)) {
                        admin = true;
                    }
                    newInfoMessage("С возвращением, " + current.getLogin());
                } else {
                    newWarnMessage("Не верный пароль. Попробуйте еще раз!");
                }
            } else {
                newWarnMessage("Не верный логин. Попробуйте еще раз!");
            }
        }
    }

    public void logout() {
        FacesContext.getCurrentInstance().getExternalContext().invalidateSession();
        newInfoMessage("Ваша сессия завершена. До встречи!");
        entered = false;
        admin = false;
        current = new User();
    }

    public void createUser() {
        if (created.getLogin().length() <= 5) {
            newWarnMessage("Логин не может быть меньше 6 символов");
            return;
        }
        if (newPass.length() <= 5) {
            newWarnMessage("Пароль не может быть меньше 6 символов");
            return;
        }
        if (!current.getAccountType().equals(AccountType.ADMIN)) {
            newWarnMessage("Вы должны быть администратором");
            return;
        } else {
            for (User user : uf.findAll()) {
                if (user.getLogin().equalsIgnoreCase(created.getLogin())) {
                    newWarnMessage("Такой пользователь уже зарегистрирован");
                    return;
                }
            }
            uf.create(created);
            newInfoMessage("Пользователь " + created.getLogin() + " успешно создан");
            created = null;
            newPass = "";
        }
    }

    public User getCurrent() {
        if (current == null) {
            current = new User();
        }
        return current;
    }

    public void setCurrent(User current) {
        this.current = current;
    }

    public boolean isEntered() {
        return entered;
    }

    public void setEntered(boolean entered) {
        this.entered = entered;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public User getCreated() {
        if (created == null) {
            created = new User();
            created.setAccountType(AccountType.GUEST);
        }
        return created;
    }

    public void setCreated(User created) {
        this.created = created;
    }

    public String getNewPass() {
        return newPass;
    }

    public void setNewPass(String newPass) {
        this.newPass = newPass;
    }

    public void newWarnMessage(String message) {
        FacesContext.getCurrentInstance().addMessage("warn", new FacesMessage(message));
    }

    public void newInfoMessage(String message) {
        FacesContext.getCurrentInstance().addMessage("warn", new FacesMessage(message));
    }

}
