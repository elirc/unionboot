using static DotnetWeb.W434;
namespace DotnetWeb;
public static class TestsW434{public static async Task Run(){await Task.CompletedTask;
{
var clock=new ManualClock();var state=new State();var host=Create(clock,state);await host.StopAsync(default);Check.Equal(0,state.Events.Count);await host.StartAsync(default);await host.StartAsync(default);clock.Advance(TimeSpan.FromMinutes(4));await host.StopAsync(default);await host.StopAsync(default);Check.Equal(new[]{"start","stop"},state.Events.ToArray());Check.Equal(TimeSpan.FromMinutes(4),state.Stopped!.Value-state.Started!.Value);
}
{
var state=new State();using var cts=new CancellationTokenSource();cts.Cancel();await Check.ThrowsAsync<OperationCanceledException>(()=>Create(new ManualClock(),state).StartAsync(cts.Token));Check.True(state.Started is null);Check.Equal(0,state.Events.Count);
}
}}
