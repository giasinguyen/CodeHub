package code.hub.codehubbackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "cloudinary.cloud-name=test-cloud",
    "cloudinary.api-key=test-api-key", 
    "cloudinary.api-secret=test-api-secret"
})
class CodeHubBackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
