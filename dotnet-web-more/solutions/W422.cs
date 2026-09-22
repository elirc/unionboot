// W422: Channel worker contracts / Drain channel batches of 2
namespace DotnetWeb;
public static class W422{

public static Task<int> Drain(ChannelReader<int> reader,ICollection<int> sink,CancellationToken token){
token.ThrowIfCancellationRequested();int n=0;while(n<2&&reader.TryRead(out var item)){sink.Add(item);n++;}return Task.FromResult(n);
}
}
