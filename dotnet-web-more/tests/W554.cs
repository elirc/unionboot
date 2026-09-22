using static DotnetWeb.W554;
namespace DotnetWeb;
public static class TestsW554{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal(new[]{"audit-4","common"},Tags(typeof(Handlers).GetMethod(nameof(Handlers.Tagged))!));Check.Equal(Array.Empty<string>(),Tags(typeof(Handlers).GetMethod(nameof(Handlers.Plain))!));
}
{
Check.Equal(new[]{"alternate"},Tags(typeof(Handlers).GetMethod(nameof(Handlers.Other))!));
}
}}
