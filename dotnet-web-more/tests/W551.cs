using static DotnetWeb.W551;
namespace DotnetWeb;
public static class TestsW551{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal(new[]{"audit-1","common"},Tags(typeof(Handlers).GetMethod(nameof(Handlers.Tagged))!));Check.Equal(Array.Empty<string>(),Tags(typeof(Handlers).GetMethod(nameof(Handlers.Plain))!));
}
{
Check.Equal(new[]{"alternate"},Tags(typeof(Handlers).GetMethod(nameof(Handlers.Other))!));
}
}}
