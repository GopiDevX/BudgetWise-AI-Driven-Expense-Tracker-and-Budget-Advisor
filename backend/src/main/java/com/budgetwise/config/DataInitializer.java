package com.budgetwise.config;

import com.budgetwise.model.entity.Role;
import com.budgetwise.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize default roles if they don't exist
        if (!roleRepository.findByName("USER").isPresent()) {
            Role userRole = new Role();
            userRole.setName("USER");
            roleRepository.save(userRole);
            System.out.println("Created USER role");
        }

        if (!roleRepository.findByName("ADMIN").isPresent()) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            roleRepository.save(adminRole);
            System.out.println("Created ADMIN role");
        }
    }
}
