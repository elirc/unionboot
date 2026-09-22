// W472: Sparse fieldset projection / Default fields title
namespace DotnetWeb;
public static class W472{
public sealed record Item(int Id,string Title,decimal Price,int Stock);
public static IResult Project(Item item,string? fields){throw new NotImplementedException("W472");}
}
