package code.hub.codehubbackend.monitoring;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

@Component
public class CustomMetrics {

    private final Counter snippetCreationCounter;
    private final Counter snippetViewCounter;
    private final Counter userRegistrationCounter;
    private final Timer snippetCreationTimer;
    private final Timer snippetSearchTimer;

    public CustomMetrics(MeterRegistry meterRegistry) {
        this.snippetCreationCounter = Counter.builder("codehub.snippets.created")
                .description("Number of snippets created")
                .register(meterRegistry);

        this.snippetViewCounter = Counter.builder("codehub.snippets.viewed")
                .description("Number of snippet views")
                .register(meterRegistry);

        this.userRegistrationCounter = Counter.builder("codehub.users.registered")
                .description("Number of user registrations")
                .register(meterRegistry);

        this.snippetCreationTimer = Timer.builder("codehub.snippets.creation.time")
                .description("Time taken to create a snippet")
                .register(meterRegistry);

        this.snippetSearchTimer = Timer.builder("codehub.snippets.search.time")
                .description("Time taken to search snippets")
                .register(meterRegistry);
    }

    public void incrementSnippetCreation() {
        snippetCreationCounter.increment();
    }

    public void incrementSnippetView() {
        snippetViewCounter.increment();
    }

    public void incrementUserRegistration() {
        userRegistrationCounter.increment();
    }

    public Timer.Sample startSnippetCreationTimer() {
        return Timer.start();
    }

    public void stopSnippetCreationTimer(Timer.Sample sample) {
        sample.stop(snippetCreationTimer);
    }

    public Timer.Sample startSnippetSearchTimer() {
        return Timer.start();
    }

    public void stopSnippetSearchTimer(Timer.Sample sample) {
        sample.stop(snippetSearchTimer);
    }
}
