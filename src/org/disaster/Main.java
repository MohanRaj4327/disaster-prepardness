package org.disaster;

import org.disaster.repository.DataStore;
import org.disaster.repository.InitialDataSeeder;
import org.disaster.server.DisasterHttpServer;

public class Main {
    public static void main(String[] args) {
        int port = 8080;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {}
        }

        System.out.println("Initializing SafePublic - Disaster Preparedness & Citizen Grievance Portal...");
        DataStore dataStore = DataStore.getInstance();
        InitialDataSeeder.seed(dataStore);

        System.out.println("Loaded Disaster Management Database:");
        System.out.println(" - " + dataStore.getAllUsers().size() + " registered administrative & citizen accounts");
        System.out.println(" - " + dataStore.getAllDepartments().size() + " emergency disaster response departments");
        System.out.println(" - " + dataStore.getAllShelters().size() + " public relief shelters & safe camps");
        System.out.println(" - " + dataStore.getAllComplaints().size() + " active public hazard grievances");
        System.out.println(" - " + dataStore.getAllLearningModules().size() + " public disaster survival guides");

        DisasterHttpServer server = new DisasterHttpServer(port, dataStore);
        try {
            server.start();
        } catch (Exception e) {
            System.err.println("Fatal: Failed to start server on port " + port + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
